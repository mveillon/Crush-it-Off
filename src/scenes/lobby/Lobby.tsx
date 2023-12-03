import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import { firebaseDB } from "../../firebase/init";
import { 
  onSnapshot, 
  doc, 
  getDoc, 
  collection,
  DocumentChange
} from "firebase/firestore";
import { 
  LOBBIES, 
  userLink, 
  USERS, 
  userT, 
  GENDER_MAP 
} from "../../firebase/dbStructure";
import genericConverter from "../../firebase/genericConverter";
import getUserID from "../../firebase/getUserID";
import CheckLoggedIn from "../../firebase/CheckLoggedIn";
import { Unsubscribe } from "firebase/auth";

import "../../global.css"
import "./lobby.css"

function Lobby() {
  const location = useLocation()
  const {
    lobbyID
  } = location.state as { lobbyID: number }

  const db = firebaseDB()

  type member = { uid: string, name: string, checked: boolean }
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

        if (attracted(userData, memberData)) {
          const toAdd = {
            uid: memberID,
            name: memberData.name,
            checked: false
          }
  
          changeSwitch(change, toAdd) 
        }    
      }
    })
  }

  const createOnSnapshot = (): Unsubscribe => {
    // TODO : also need to listen to changes to users collection
    // in case someone edits their profile after joining a lobby,
    // but we want to somehow query the onSnapshot to only listen
    // to users who are in the lobby to limit reads. Problem is, 
    // we have to set up the query in the useEffect before we have
    // the full list of members of the lobby so this might not be
    // possible. One option is to have lobbyMembers be a dependency,
    // but we have to be careful to always unsubscribe before creating
    // a new onSnapshot. Also look into having multiple useEffects for
    // simplicity and organization
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

    const unsub = onSnapshot(memberRef, memberSnapshot => {
      memberSnapshot.docChanges().forEach(change => {
        handleChange(userData, change)
      })
    })

    return unsub
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
        throw new Error(`Invalid lobby id ${lobbyID}`)
      }
    }))
  }, [])

  useEffect(() => {
    if (typeof userData !== 'undefined') {
      return createOnSnapshot()
    }
  }, [lobbyMembers, userData])

  const toggleChecked = (ind: number) => {
    lobbyMembers[ind].checked = !lobbyMembers[ind].checked
    setLobbyMembers(lobbyMembers)
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
                <label key={i}>{member.name}
                  <input
                    type="checkbox"
                    checked={member.checked}
                    onChange={(e) => toggleChecked(i)}
                  />
                </label>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Lobby
