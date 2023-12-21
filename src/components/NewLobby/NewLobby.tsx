import React from "react";

import { firebaseDB } from "../../firebase/init";
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useNavigate } from "react-router-dom";
import { LOBBIES, NUM_LOBBIES, numLobbiesT } from "../../firebase/dbStructure";
import genericConverter from "../../firebase/genericConverter";
import getUserID from "../../firebase/getUserID";
import { randInt } from "../../utils/random";

import "../../global.css";
import "./new-lobby.css";

function NewLobby() {
  const navigate = useNavigate()
  const db = firebaseDB()

  const newLobbyID = async (numLobbies: number): Promise<string> => {
    const numDigits = Math.max(
      5,
      Math.ceil(Math.log10(Math.max(1, numLobbies)))
    )

    const idUsed = async (id: string): Promise<boolean> => {
      const lobbyDoc = doc(
        db,
        LOBBIES,
        id
      )
      const snapshot = await getDoc(lobbyDoc)
      return snapshot.exists()
    }

    const newID = (): string => {
      const ten = Math.pow(10, numDigits - 1)
      return randInt(ten, 10 * ten).toString()
    }

    let n = newID()
    while (await idUsed(n)) {
      n = newID()
    }

    return n
  }

  const createLobby = async () => {

    const nlDoc = (
      doc(db, NUM_LOBBIES, NUM_LOBBIES)
        .withConverter(genericConverter<numLobbiesT>())
    )

    const snapshot = await getDoc(nlDoc)
    if (snapshot.exists()) {
      const numLobbies = snapshot.data().n
      const lobbyID = await newLobbyID(numLobbies)

      setDoc(
        doc(db, LOBBIES, lobbyID),
        {}
      )

      setDoc(
        doc(db, LOBBIES, lobbyID, "users", getUserID()),
        {
          submitted: false,
          crushes: []
        }
      )

      setDoc(nlDoc, {"n": numLobbies + 1})

      navigate(
        "/lobby",
        { state: { lobbyID: lobbyID } }
      )
    } else {
      throw new Error("numLobbies data not found!")
    }
  }

  return (
    <div>
      <button onClick={createLobby} className="new-lobby">
        Create New Lobby
      </button>
    </div>
  )
}

export default NewLobby
