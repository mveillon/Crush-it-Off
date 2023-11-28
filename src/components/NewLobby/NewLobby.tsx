import React from "react";

import { firebaseDB } from "../../firebase/init";

import { doc, getDoc, setDoc } from "firebase/firestore"
import "../../global.css"
import "./new-lobby.css"
import { useNavigate } from "react-router-dom";
import { LOBBIES, NUM_LOBBIES, numLobbiesT } from "../../firebase/dbStructure";
import genericConverter from "../../firebase/genericConverter";

function NewLobby() {
  const navigate = useNavigate()
  const createLobby = () => {
    const db = firebaseDB()

    const nlDoc = (
      doc(db, NUM_LOBBIES, NUM_LOBBIES).withConverter(genericConverter<numLobbiesT>())
    )
    getDoc(nlDoc)
      .then(snapshot => {
      if (snapshot.exists()) {
        const numLobbies = snapshot.data().n
        setDoc(
          doc(db, LOBBIES, `${numLobbies}`), 
          {
            "users": [{
              "uid": localStorage.getItem("userID"),
              "crushes": []
            }]
          }
        )

        setDoc(nlDoc, {"n": numLobbies + 1})

        navigate(
          "/lobby",
          { state: { lobbyID: numLobbies } }
        )
      } else {
        throw new Error("numLobbies data not found!")
      }
    })
  }

  return (
    <div>
      <button onClick={createLobby}>Create New Lobby</button>
    </div>
  )
}

export default NewLobby
