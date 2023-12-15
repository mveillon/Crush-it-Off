import React, { useState, useEffect } from "react";

import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import CheckLoggedIn from "../../firebase/CheckLoggedIn";
import { LOBBIES, USERS, userLink, userT } from "../../firebase/dbStructure";
import { firebaseDB } from "../../firebase/init";
import { 
  Unsubscribe,
  collection,
  doc, 
  getDoc, 
  onSnapshot,
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
  type member = { name: string, submitted: boolean }
  const [members, setMembers] = useState<{ [index: string]: member }>({})

  const navigate = useNavigate()

  const goToMatches = () => {
    navigate(
      "/matches",
      { state: { lobbyID: lobbyID } }
    )
  }

  const getMemberName = async (memberID: string): Promise<string> => {
    const memRef = (
      doc(
        db,
        USERS,
        memberID
      ).withConverter(genericConverter<userT>())
    )

    const memberSnap = await getDoc(memRef)
    if (memberSnap.exists()) {
      return memberSnap.data().name
    }

    throw new Error(`Invalid user ID ${memberID} in lobby ${lobbyID}`)
  }

  const createOnSnapshot = (lobbyQ: Query<userLink, userLink>): Unsubscribe => {
    return onSnapshot(lobbyQ, (memberSnapshot => {
      let foundSelecting = false

      const newMembers = {...members}
      const workers: Promise<[string, member]>[] = []
      for (const doc of memberSnapshot.docs) {
        const link = doc.data()
        if (!link.submitted) {
          foundSelecting = true
        }

        if (doc.id in members) {
          const newMem = {
            name: members[doc.id].name,
            submitted: link.submitted
          }
          newMembers[doc.id] = newMem

        } else {
          workers.push(new Promise((resolve, reject) => {
            getMemberName(doc.id)
              .then(name => {
                const newMem = {
                  name: name,
                  submitted: link.submitted
                }
                resolve([doc.id, newMem])
              })
              .catch(error => { reject(error) })
          }))
        }
      }

      if (!foundSelecting) {
        goToMatches()
      }

      Promise.all(workers).then(memList => {
        for (const [uid, mem] of memList) {
          newMembers[uid] = mem
        }

        setMembers(newMembers)
      })
    }))
  }

  useEffect(() => {
    const lobbyRef = (
      collection(
        db,
        LOBBIES,
        `${lobbyID}`,
        "users"
      ).withConverter(genericConverter<userLink>())
    )

    return createOnSnapshot(lobbyRef)
  }, [])

  return (
    <div>
      <CheckLoggedIn redirectBack="/waiting-room" state={location.state} />
      <Header />

      <div className="content">
        <h1 className="title">
          Lobby {lobbyID} is waiting for submissions from:
        </h1>

        <div className="waiting-names">
          {
            Object.keys(members)
              .filter(uid => !members[uid].submitted)
              .sort((uid1, uid2) => {
                const name1 = members[uid1].name
                const name2 = members[uid2].name
                if (name1 < name2) return -1
                if (name1 > name2) return 1
                return 0
              })
              .map(uid => {
                return (
                  <p key={uid}>{members[uid].name}</p>
                )
              })
          }
        </div>
      </div>
    </div>
  )
}

export default WaitingRoom
