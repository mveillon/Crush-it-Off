import React, { FormEvent, useState } from "react";

import { useNavigate } from "react-router-dom";
import { firebaseDB } from "../../firebase/init";

import "../../global.css"
import "./join-lobby.css"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { LOBBIES } from "../../firebase/dbStructure";
import getUserID from "../../firebase/getUserID";

function JoinLobby() {
  const db = firebaseDB()
  const [invalidInput, setInvalidInput] = useState(false)
  const [code, setCode] = useState("")

  const navigate = useNavigate()
  const goToLobby = (e: FormEvent) => {
    e.preventDefault()
    const intCode = parseInt(code)
    if (isNaN(intCode) || intCode < 0) {
      setInvalidInput(true)

    } else {
      const lobbyRef = (
        doc(db, LOBBIES, code)
      )

      getDoc(lobbyRef).then(snapshot => {
        if (snapshot.exists()) {
          const newUserPath = (
            doc(db, LOBBIES, code, "users", getUserID())
          )

          setDoc(newUserPath, {
            uid: getUserID(),
            submitted: false,
            crushes: []
          })

          navigate(
            "/lobby",
            { state: { lobbyID: intCode } }
          )
        } else {
          setInvalidInput(true)
        }
      })
    }
  }

  return (
    <div>
      <form onSubmit={goToLobby}>
        <label>Code: 
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoFocus={true}
          />
        </label>

        <input type="submit" value="Join Lobby" />
      </form>

      {
        invalidInput &&
        <p>Please input a valid code</p>
      }
    </div>
  )
}

export default JoinLobby