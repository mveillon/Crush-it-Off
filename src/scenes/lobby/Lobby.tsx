import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { firebaseDB } from "../../firebase/init";
import { 
  onSnapshot, 
  doc, 
  getDoc, 
  collection,
  DocumentChange,
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

  // could p1 be attracted to p2
  const attracted = (p1: userT, p2: userT): boolean => {
    return p1.preferences[GENDER_MAP[p2.gender]]
  }

  const changeSwitch = (
    change: DocumentChange, 
    toAdd: member
  ) => {
    switch(change.type) {
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
        setLobbyMembers(
          lobbyMembers.filter(mem => mem.uid !== toAdd.uid)
        )
        break;

      default:
        throw new Error(`Unsupported change type: ${change.type}`)
    }
  }

  const handleChange = (
    userData: userT,
    change: DocumentChange
  ) => {
    const memberID = change.doc.id
    const memDoc = (
      doc(db, USERS, memberID).withConverter(genericConverter<userT>())
    )

    getDoc(memDoc).then(newMember => {
      if (newMember.exists()) {
        const memberData = newMember.data()

        const pfpRef = ref(storage, `${PFPs}/${memberData["profile-pic"]}`)
        getDownloadURL(pfpRef).then(url => {
          if (attracted(userData, memberData)) {
            const toAdd = {
              uid: memberID,
              name: memberData.name,
              checked: false,
              pfp: url
            }
    
            changeSwitch(change, toAdd)
          }
        })  
      }
    })
  }

  const createOnSnapshot = (): Unsubscribe => {
    if (typeof userData === 'undefined') {
      // should never happen
      throw new Error('userData is undefined')
    }
    
    const memberRef = (
      collection(
        db,
        LOBBIES,
        `${lobbyID}`,
        "users"
      ).withConverter(genericConverter<userLink>())
    )

    return onSnapshot(memberRef, memberSnapshot => {
      for (const change of memberSnapshot.docChanges()) {
        handleChange(userData, change)
      }
    })
  }

  const userChangesSnapshot = (): Unsubscribe => {
    const memberIDs = lobbyMembers.map(member => member.uid)
    const allUsers = (
      collection(
        db,
        USERS
      ).withConverter(genericConverter<userT>())
    )
    const justMembersQ = (
      query(allUsers, where(documentId(), "in", memberIDs))
    )

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
  
            changeSwitch(change, newMember)
          })
        }
      }
    })
  }

  useEffect(() => {
    const userDoc = (
      doc(db, USERS, getUserID()).withConverter(genericConverter<userT>())
    )
    
    getDoc(userDoc).then((snapshot => {
      if (snapshot.exists()) {
        const userData = snapshot.data()
        setUserData(userData)
      } else {
        throw new Error("Could not authenticate user")
      }
    }))
  }, [])

  useEffect(() => {
    if (typeof userData !== 'undefined') {
      const unsub = createOnSnapshot()
      let unsub2 = () => {}
      if (lobbyMembers.length > 0) {
        unsub2 = userChangesSnapshot()
      }
      
      return () => {
        unsub()
        unsub2()
      }
    }
  }, [lobbyMembers, userData])

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
        <h2>{`Enter code ${lobbyID} to join lobby!`}</h2>
        
        <h3>Check off the names you would go on a date with: </h3>
        <div className="names">
          {
            lobbyMembers.map((member, i) => {
              return (
                <div key={i}>
                  <label>{member.name}
                    <input
                      type="checkbox"
                      checked={member.checked}
                      onChange={(e) => toggleChecked(i)}
                    />
                  </label>
                  <img src={member.pfp} />
                </div>
              )
            })
          }
        </div>

        <button onClick={submitCrushes}>Submit Crushes</button>

      </div>
    </div>
  )
}

export default Lobby
