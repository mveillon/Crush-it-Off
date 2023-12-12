import React, { useEffect, useState } from "react";

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
    pfp: string
  }
  const [lobbyMembers, setLobbyMembers] = useState<member[]>([])
  const [userData, setUserData] = useState<userT | undefined>(undefined)
  const [allMembers, setAllMembers] = useState<string[]>([])

  // could p1 be attracted to p2
  const attracted = (p1: userT, p2: userT): boolean => {
    return p1.email !== p2.email && p1.preferences[GENDER_MAP[p2.gender]]
  }

  const changeSwitch = (
    changeType: string, 
    toAdd: member
  ) => {
    switch(changeType) {
      case "added":
        let found = false
        for (const mem of lobbyMembers) {
          if (mem.uid === toAdd.uid) {
            found = true
            break
          }
        }
        if (!found) setLobbyMembers([...lobbyMembers, toAdd])
        break;

      case "modified":
        for (let i = 0; i < lobbyMembers.length; i++) {
          if (lobbyMembers[i].uid === toAdd.uid) {
            const end = (
              i < lobbyMembers.length - 1 ? 
              lobbyMembers.slice(i + 1, lobbyMembers.length) : 
              []
            )

            setLobbyMembers([
              ...lobbyMembers.slice(0, i),
              toAdd,
              ...end
            ])
            break;
          }
        }
        break;

      case "removed":
        console.log('removing')
        setLobbyMembers(
          lobbyMembers.filter(mem => mem.uid !== toAdd.uid)
        )
        break;

      default:
        throw new Error(`Unsupported change type: ${changeType}`)
    }
  }

  const lookupID = async (
    userData: userT, 
    memberID: string
  ): Promise<member | undefined> => {
    const memDoc = (
      doc(db, USERS, memberID).withConverter(genericConverter<userT>())
    )

    const newMember = await getDoc(memDoc)
    if (newMember.exists()) {
      const memberData = newMember.data()

      const pfpRef = ref(storage, `${PFPs}/${memberData["profile-pic"]}`)
      const url = await getDownloadURL(pfpRef)
      if (attracted(userData, memberData)) {
        const toAdd = {
          uid: memberID,
          name: memberData.name,
          checked: false,
          pfp: url
        }

        return toAdd
      }
    }

    return undefined
  }

  const createOnSnapshot = (theUser: userT): Unsubscribe => {
    const memberRef = (
      collection(
        db,
        LOBBIES,
        `${lobbyID}`,
        "users"
      ).withConverter(genericConverter<userLink>())
    )

    return onSnapshot(memberRef, memberSnapshot => {
      const newMembers = (
        memberSnapshot.docs.map(doc => lookupID(theUser, doc.id))
      )

      Promise.all(newMembers).then(mems => {
        setLobbyMembers(
          (mems.filter(m => typeof m !== 'undefined')) as member[]
        )
      })

      setAllMembers(memberSnapshot.docs.map(doc => doc.id))
    })
  }

  // returns either "added", "removed", or "modified" based on 
  // whether the user changed their gender or not
  const changedGenderType = (memberID: string, memberData: userT): string => {
    if (typeof userData === 'undefined') {
      throw new Error('userData is undefined')
    }

    let found = false
    for (const lobbyMem of lobbyMembers) {
      if (lobbyMem.uid === memberID) {
        found = true
        break
      }
    }

    const inAll = allMembers.includes(memberID)
    const userInto = attracted(userData, memberData)
    
    if (inAll && !found && userInto) return "added"
    else if (found && !userInto) return "removed"
    return "modified"
    
  }

  const userChangesSnapshot = (): Unsubscribe => {
    const allUsers = (
      collection(
        db,
        USERS
      ).withConverter(genericConverter<userT>())
    )
    const justMembersQ = (
      query(allUsers, where(documentId(), "in", allMembers))
    )

    // TODO : this doesn't seem to be working in the removal case
    return onSnapshot(justMembersQ, snapshot => {
      for (const change of snapshot.docChanges()) {
        if (change.type === "modified") {
          const memberData = change.doc.data()
          const pfpRef = ref(storage, `${PFPs}/${memberData["profile-pic"]}`)

          getDownloadURL(pfpRef).then(url => {
            const newMember: member = {
              uid: change.doc.id,
              name: memberData.name,
              pfp: url,
              checked: false
            }

            changeSwitch(
              changedGenderType(change.doc.id, memberData), 
              newMember
            )
          })
        }
      }
    })
  }

  useEffect(() => {
    const u = new Promise<Unsubscribe>((resolve, _) => {
      const userDoc = (
        doc(db, USERS, getUserID()).withConverter(genericConverter<userT>())
      )
      
      getDoc(userDoc).then((snapshot => {
        if (snapshot.exists()) {
          const userData = snapshot.data()
          const unsub = createOnSnapshot(userData)
          setUserData(userData)
          resolve(unsub)

        } else {
          throw new Error("Could not authenticate user")
        }
      }))
    })
    
    return () => { u.then(unsub => unsub()) }
  }, [])

  useEffect(() => {
    if (typeof userData !== 'undefined') {
      let unsub = () => {}
      if (lobbyMembers.length > 0) {
        unsub = userChangesSnapshot()
      }
      
      return () => {
        unsub()
      }
    }
  }, [allMembers, userData])

  const toggleChecked = (ind: number) => {
    lobbyMembers[ind].checked = !lobbyMembers[ind].checked
    setLobbyMembers([...lobbyMembers])
  }

  const navigate = useNavigate()
  const submitCrushes = () => {
    const userMember = (
      doc(
        db,
        LOBBIES,
        `${lobbyID}`,
        "users",
        getUserID()
      ).withConverter(genericConverter<userLink>())
    )

    setDoc(
      userMember, 
      {
        submitted: true,
        crushes: lobbyMembers.filter(mem => mem.checked).map(mem => mem.uid)
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
              lobbyMembers
                .sort((mem1, mem2) => {
                  if (mem1.name < mem2.name) return -1
                  if (mem1.name > mem2.name) return 1
                  return 0
                })
                .map((member, i) => {
                return (
                  <MemberCard
                    name={member.name}
                    pfpUrl={member.pfp}
                    checked={member.checked}
                    onCheck={() => toggleChecked(i)}
                    key={i}
                  />
                )
              })
            }
          </div>

          <button onClick={submitCrushes}>Submit Crushes</button>
        </div>
      </div>
    </div>
  )
}

export default Lobby
