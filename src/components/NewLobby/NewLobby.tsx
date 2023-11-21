import React from "react";

import { firebaseDB } from "../../firebase/init";
import { ref, push, set, get } from "firebase/database"
import "../../global.css"
import "./new-lobby.css"

function NewLobby() {
  const createLobby = () => {
    const db = firebaseDB()
    const numLobbiesRef = ref(db, "numLobbies")

    get(numLobbiesRef).then(snapshot => {
      if (snapshot.exists()) {
        const numLobbies = snapshot.val()
        push(ref(db, "lobbies/"), {"lobbyID": numLobbies})

        set(numLobbiesRef, numLobbies + 1)
      } else {
        throw new Error("numLobbies data has disappeared!")
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
