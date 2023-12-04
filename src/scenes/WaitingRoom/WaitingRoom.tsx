import React, { useState, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import CheckLoggedIn from "../../firebase/CheckLoggedIn";
import { LOBBIES, USERS, userLink, userT } from "../../firebase/dbStructure";
import getUserID from "../../firebase/getUserID";
import { firebaseDB } from "../../firebase/init";
import { 
  DocumentChange,
  Unsubscribe,
  collection,
  doc, 
  getDoc, 
  onSnapshot, 
  query,
  where,
  Query
} from "firebase/firestore";
import genericConverter from "../../firebase/genericConverter";

import "./waiting-room.css"
import "../../global.css"

function WaitingRoom() {
  const location = useLocation()
  const {
    lobbyID
  } = location.state as { lobbyID: number }

  const db = firebaseDB()
  type member = { name: string, uid: string }
  const [notSubmitted, setNotSubmitted] = useState<member[]>([])
  const [userData, setUserData] = useState<userT | undefined>(undefined)

  const navigate = useNavigate()

  const goToMatches = () => {
    navigate(
      "/matches",
      { state: { lobbyID: lobbyID } }
    )
  }

  const changeSwitch = (change: DocumentChange, toAdd: member) => {
    switch(change.type) {
      case "added":
        let found = false
        for (let i = 0; i < notSubmitted.length; i++) {
          if (notSubmitted[i].uid === toAdd.uid) {
            found = true
            break;
          }
        }
        if (!found) setNotSubmitted([...notSubmitted, toAdd])
        break;

      // @ts-ignore
      case "modified":
        if (!change.doc.data().submitted) {
          for (let i = 0; i < notSubmitted.length; i++) {
            if (notSubmitted[i].uid === toAdd.uid) {
              const end = (
                i < notSubmitted.length - 1 ?
                notSubmitted.slice(i + 1, notSubmitted.length) :
                []
              )
              setNotSubmitted([
                ...notSubmitted.slice(0, i),
                toAdd,
                ...end
              ])
            }
          }
          break;
        } // intentionally not breaking in else case

      case "removed":
        const newList = notSubmitted.filter(mem => mem.uid !== toAdd.uid)
        if (newList.length === 0) {
          goToMatches()
        } else {
          setNotSubmitted(
            newList
          )
        }
        break;

      default:
        throw new Error(`Unsupported change type: ${change.type}`)
    }
  }

  const createOnSnapshot = (lobbyQ: Query<userLink, userLink>): Unsubscribe => {
    return onSnapshot(lobbyQ, (memberSnapshot => {
      if (memberSnapshot.empty) {
        goToMatches()
      }
      
      for (const change of memberSnapshot.docChanges()) {
        const memberID = change.doc.id
        const memDoc = (
          doc(db, USERS, memberID).withConverter(genericConverter<userT>())
        )

        getDoc(memDoc).then(newMemSnapshot => {
          if (newMemSnapshot.exists()) {
            const newMember = newMemSnapshot.data()
            const toAdd: member = {
              name: newMember.name,
              uid: memberID
            }

            changeSwitch(change, toAdd)
          } else {
            throw new Error(`Unrecognized user ID ${memberID} in lobby ${lobbyID}`)
          }
        })
      }
    }))
  }

  useEffect(() => {
    const uid = getUserID()
    const userDoc = (
      doc(db, USERS, uid).withConverter(genericConverter<userT>())
    )
    getDoc(userDoc).then(userSnap => {
      if (userSnap.exists()) {
        setUserData(userSnap.data())
      } else {
        throw new Error(`Cannot authenticate user with uid ${uid}`)
      }
    })
  }, [])

  useEffect(() => {
    if (typeof userData !== "undefined") {
      const lobbyRef = (
        collection(
          db,
          LOBBIES,
          `${lobbyID}`,
          "users"
        ).withConverter(genericConverter<userLink>())
      )

      const lobbyQ = query(lobbyRef, where("submitted", "==", false))
      return createOnSnapshot(lobbyQ)
    }
  }, [notSubmitted, userData])

  return (
    <div>
      <CheckLoggedIn redirectBack="/waiting-room" state={location.state} />
      <Header />

      <div className="content">
        <h1 className="title">Waiting for submissions from:</h1>

        <div className="waiting-names">
          {
            notSubmitted.map((member, i) => {
              return (
                <p key={i}>{member.name}</p>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default WaitingRoom
