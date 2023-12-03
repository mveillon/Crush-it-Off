import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import { firebaseDB } from "../../firebase/init";
import { 
  onSnapshot, 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  QueryFieldFilterConstraint, 
  or,
  DocumentChange
} from "firebase/firestore";
import { LOBBIES, userLink, USERS, userT } from "../../firebase/dbStructure";
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

  const [lobbyMembers, setLobbyMembers] = useState<{
    uid: string,
    name: string,
    checked: boolean
  }[]>([])

  const handleChange = (change: DocumentChange<userLink, userLink>) => {
    console.log(change.doc.data())
    const memberID = change.doc.data().uid
    const memDoc = (
      doc(db, USERS, memberID).withConverter(genericConverter<userT>())
    )
    getDoc(memDoc).then(newMember => {
      if (newMember.exists()) {
        const memberData = newMember.data()
        const toAdd = {
          uid: memberID,
          name: memberData.name,
          checked: false
        }

        switch(change.type) {
          case "added":
            setLobbyMembers([...lobbyMembers, toAdd])
            break;

          case "modified":
            for (let i = 0; i < lobbyMembers.length; i++) {
              if (lobbyMembers[i].uid === toAdd.uid) {
                lobbyMembers[i] = toAdd
                setLobbyMembers(lobbyMembers)
                break;
              }
            }
            break;

          case "removed":
            setLobbyMembers(
              lobbyMembers.filter(mem => mem.uid != toAdd.uid)
            )
            break;
          default:
            throw new Error(`Unsupported change type: ${change.type}`)
        }
      }
    })
  }

  const createOnSnapshot = (userData: userT): Unsubscribe => {
    let wheres: QueryFieldFilterConstraint[] = [];
    ['Male', 'Female', 'Non-Binary'].forEach((g, i) => {
      if (userData.preferences[i]) {
        wheres.push(where('gender', '==', g))
      }
    })

    if (wheres.length === 0) {
      // should always return true. This should never happen but just in case
      wheres = [where('name', '!=', '')]
    }

    const memberRef = (
      collection(
        db,
        LOBBIES,
        `${lobbyID}`,
        "users"
      ).withConverter(genericConverter<userLink>())
    )
    const q = query(memberRef, or(...wheres))

    const unsub = onSnapshot(q, memberSnapshot => {
      memberSnapshot.docChanges().forEach(change => {
        handleChange(change)
      })
    })

    return unsub
  }

  useEffect(() => {
    const u = (async (): Promise<Unsubscribe> => {
      const userDoc = (
        doc(db, USERS, getUserID()).withConverter(genericConverter<userT>())
      )
      
      const snapshot = await getDoc(userDoc)
  
      if (snapshot.exists()) {
        const userData = snapshot.data()
        const unsub = createOnSnapshot(userData)
    
        return unsub
      } else {
        throw new Error(`Invalid lobby id ${lobbyID}`)
      }
    })()
    
    return () => { u.then(unsub => unsub()) }
  }, [])

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
