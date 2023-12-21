import React, { useEffect, useMemo, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { firebaseDB } from "../../firebase/init";
import { 
  onSnapshot, 
  doc, 
  getDoc, 
  collection,
  setDoc,
  query,
  where,
  documentId
} from "firebase/firestore";
import { 
  LOBBIES, 
  userLink, 
  USERS, 
  userT, 
  GENDER_MAP, 
  PFPs
} from "../../firebase/dbStructure";
import genericConverter from "../../firebase/genericConverter";
import getUserID from "../../firebase/getUserID";
import CheckLoggedIn from "../../firebase/CheckLoggedIn";
import { Unsubscribe } from "firebase/auth";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import MemberCard from "../../components/MemberCard/MemberCard";

import "../../global.css"
import "./lobby.css"

function Lobby() {
  const location = useLocation()
  const {
    lobbyID
  } = location.state as { lobbyID: number }

  const db = firebaseDB()
  const storage = getStorage()

  type member = { 
    uid: string, 
    name: string, 
    checked: boolean,
    pfp: string,
    gender: string,
    preferences: boolean[]
  }

  const [allMembers, setAllMembers] = useState<{ [index: string]: member }>({})
  const [userData, setUserData] = useState<userT | undefined>(undefined)
  const userID = useMemo(() => getUserID(), [])

  // could u be attracted to the user with uid otherID
  const attracted = (u: userT, otherID: string): boolean => {
    if (!(otherID in allMembers)) {
      throw new Error(`Cannot find user ${otherID} in lobby ${lobbyID}`)
    }
    
    const otherMember = allMembers[otherID]
    const uToO = u.preferences[GENDER_MAP[otherMember.gender]]
    const oToU = otherMember.preferences[GENDER_MAP[u.gender]]
    return uToO && oToU
  }

  const getMemberData = async (memberID: string): Promise<member> => {
    const memDoc = (
      doc(db, USERS, memberID).withConverter(genericConverter<userT>())
    )

    const newMember = await getDoc(memDoc)
    if (newMember.exists()) {
      const memberData = newMember.data()

      const pfpRef = ref(storage, `${PFPs}/${memberData["profile-pic"]}`)
      const url = await getDownloadURL(pfpRef)

      const toAdd: member = {
        uid: memberID,
        name: memberData.name,
        gender: memberData.gender,
        checked: false,
        pfp: url,
        preferences: memberData.preferences
      }

      return toAdd
    } else {
      throw new Error(`Cannot resolve memberID ${memberID} in lobby ${lobbyID}`)
    }
  }

  const addMembers = (ids: string[]) => {
    const newMembers = {...allMembers}
    const workers: Promise<void>[] = []

    for (const id of ids) {
      if (!(id in allMembers)) {
        workers.push(new Promise((resolve) => {
          getMemberData(id).then(toAdd => {
            newMembers[id] = toAdd
            resolve()
          })
        }))
      }
    }

    Promise.all(workers).then(_ => {
      setAllMembers(newMembers)
    })
  }

  const createOnSnapshot = (): Unsubscribe => {
    const memberRef = (
      collection(
        db,
        LOBBIES,
        `${lobbyID}`,
        "users"
      ).withConverter(genericConverter<userLink>())
    )

    return onSnapshot(memberRef, memberSnapshot => {
      addMembers(memberSnapshot.docs.map(doc => doc.id))
    })
  }

  const handleUserChanges = (newMembers: member[]) => {
    if (newMembers.length === 0) return

    const newCache = {...allMembers}
    for (const toAdd of newMembers) {
      newCache[toAdd.uid] = toAdd
    }

    setAllMembers(newCache)
  }

  const userChangesSnapshot = (): Unsubscribe => {
    const allUsers = (
      collection(
        db,
        USERS
      ).withConverter(genericConverter<userT>())
    )
    const justMembersQ = (
      query(allUsers, where(documentId(), "in", Object.keys(allMembers)))
    )

    return onSnapshot(justMembersQ, snapshot => {
      const memberCollectors: Promise<member>[] = []

      for (const change of snapshot.docChanges()) {
        if (change.type === "modified") {
          const memberData = change.doc.data()

          const pfpRef = ref(storage, `${PFPs}/${memberData["profile-pic"]}`)
          const p = new Promise<member>((resolve) => {
            getDownloadURL(pfpRef).then(url => {
              const toAdd: member = {
                uid: change.doc.id,
                name: memberData.name,
                gender: memberData.gender,
                checked: false,
                pfp: url,
                preferences: memberData.preferences
              }
              resolve(toAdd)
            })
          })
          memberCollectors.push(p)
        }
      }

      Promise.all(memberCollectors).then(newMembers => {
        handleUserChanges(newMembers)
      })
    })
  }

  useEffect(() => {
    const u = new Promise<Unsubscribe>((resolve) => {
      const userDoc = (
        doc(db, USERS, userID).withConverter(genericConverter<userT>())
      )
      
      getDoc(userDoc).then((snapshot => {
        if (snapshot.exists()) {
          setUserData(snapshot.data())
          resolve(createOnSnapshot())

        } else {
          throw new Error("Could not authenticate user")
        }
      }))
    })
    
    return () => { u.then(unsub => unsub()) }
  }, [])

  useEffect(() => {
    let unsub = () => {}
    if (Object.keys(allMembers).length > 0) {
      unsub = userChangesSnapshot()
    }
    
    return () => {
      unsub()
    }
  }, [allMembers])

  const toggleChecked = (id: string) => {
    const oldMember = allMembers[id]
    const newMember = {
      ...oldMember,
      checked: !oldMember.checked
    }

    setAllMembers({...allMembers, [id]: newMember})
  }

  const navigate = useNavigate()
  const submitCrushes = () => {
    const userMember = (
      doc(
        db,
        LOBBIES,
        `${lobbyID}`,
        "users",
        userID
      ).withConverter(genericConverter<userLink>())
    )

    setDoc(
      userMember, 
      {
        submitted: true,
        crushes: Object.keys(allMembers).filter(uid => allMembers[uid].checked)
      }
    )

    navigate(
      "/waiting-room",
      { state: { lobbyID: lobbyID } }
    )
  }

  return (
    <div>
      <CheckLoggedIn redirectBack="/lobby" state={location.state} />
      <Header />

      <div className="content">
        <h1 className="title">{`Enter code ${lobbyID} to join lobby!`}</h1>
        
        <div className="lobby">
          <h2>Check off the names you would go on a date with: </h2>
          <div className="names">
            {
              typeof userData !== "undefined" &&
              Object.keys(allMembers)
                .filter(uid => (
                  uid !== userID && 
                  attracted(userData, uid)
                ))
                .sort((uid1, uid2) => {
                  const name1 = allMembers[uid1].name
                  const name2 = allMembers[uid2].name
                  if (name1 < name2) return -1
                  if (name1 > name2) return 1
                  return 0
                })
                .map(uid => (
                  <MemberCard
                    name={allMembers[uid].name}
                    pfpUrl={allMembers[uid].pfp}
                    checked={allMembers[uid].checked}
                    onCheck={() => toggleChecked(uid)}
                    key={uid}
                  />
                ))
            }
          </div>

          <button onClick={submitCrushes}>Submit Selections</button>
        </div>
      </div>
    </div>
  )
}

export default Lobby
