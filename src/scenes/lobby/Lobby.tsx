import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import "../../global.css"
import "./lobby.css"
import Header from "../../components/Header/Header";
import { firebaseDB } from "../../firebase/init";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { LOBBIES, userLink } from "../../firebase/dbStructure";
import genericConverter from "../../firebase/genericConverter";

function Lobby() {
  const location = useLocation()
  const {
    lobbyID
  } = location.state as { lobbyID: number }

  const db = firebaseDB()
  const [users, setUsers] = useState<userLink[]>([])

  useEffect(() => {
    const lobbyDoc = (
      doc(db, LOBBIES, `${lobbyID}`).withConverter(genericConverter<userLink>())
    )
    onSnapshot(lobbyDoc, userSnap => {
      if (userSnap.exists()) {
        const user = userSnap.data()
        users.push(user)
        setUsers(users)

      } else {
        throw new Error(`Invalid lobby id ${lobbyID}`)
      }
    })
    
  }, [])

  return (
    <div>
      <Header />

      <div className="content">
        <h1>{`Enter code ${lobbyID} to join lobby!`}</h1>
      </div>
    </div>
  )
}

export default Lobby
