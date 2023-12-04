import React, { useEffect, useState } from "react"

import Header from "../../components/Header/Header"
import CheckLoggedIn from "../../firebase/CheckLoggedIn"
import { useLocation } from "react-router-dom"
import getUserID from "../../firebase/getUserID"
import { firebaseDB } from "../../firebase/init"

import "./matches.css"
import "../../global.css"
import { doc, getDoc } from "firebase/firestore"
import { LOBBIES, USERS, userLink, userT } from "../../firebase/dbStructure"
import genericConverter from "../../firebase/genericConverter"
import Match from "../../components/Match/Match"

function Matches() {
  const location = useLocation()
  const {
    lobbyID
  } = location.state as { lobbyID: number }

  const db = firebaseDB()
  const [matches, setMatches] = useState<string[]>([])
  const [doneQuerying, setDoneQuerying] = useState(false)

  useEffect(() => {
    (async () => {
      const userID = getUserID()
      const userDoc = (
        doc(
          db,
          LOBBIES,
          `${lobbyID}`,
          "users",
          userID,
        ).withConverter(genericConverter<userLink>())
      )

      const userSnap = await getDoc(userDoc)
      if (userSnap.exists()) {
        const userData = userSnap.data()
        const matchIDs: string[] = []
        
        for (const crushID of userData.crushes) {
          const crushDoc = (
            doc(
              db,
              LOBBIES,
              `${lobbyID}`,
              "users",
              crushID
            ).withConverter(genericConverter<userLink>())
          )

          const crushSnap = await getDoc(crushDoc)
          if (crushSnap.exists()) {
            const crushData = crushSnap.data()
            if (crushData.crushes.includes(userID)) {
              matchIDs.push(crushID)
            }
          } else {
            throw new Error(`Invalid ID in ${userID} crushes: ${crushID}`)
          }
        }

        const tempMatches: string[] = []
        for (const crushID of matchIDs) {
          const crushDoc = (
            doc(
              db,
              USERS,
              crushID
            ).withConverter(genericConverter<userT>())
          )

          const crushSnap = await getDoc(crushDoc)
          if (crushSnap.exists()) {
            tempMatches.push(crushSnap.data().name)
          } else {
            throw new Error(`Could not find ID ${crushID} in users collection`)
          }
        }

        setMatches(tempMatches)
        setDoneQuerying(true)
      } else {
        throw new Error(`Cannot find user ${userID} in lobby ${lobbyID}`)
      }
    })()
  }, [])

  const numMatches = (): string => {
    const start = 'You have'
    const plural = matches.length === 1 ? '' : 'es'
    return `${start} ${matches.length} match${plural}!`
  }

  return (
    <div>
      <CheckLoggedIn redirectBack="/matches" />
      <Header />

      <div className="content">
        <h1 className="title">Your matches:</h1>

        <div className="matches">
          {
            matches.map((name, i) => {
              return (
                <Match name={name} key={i} />
              )
            })
          }

          {
            doneQuerying &&
            <h2 className="num-matches">
              {numMatches()}
            </h2>
          }
        </div>
      </div>
    </div>
  )
}

export default Matches
