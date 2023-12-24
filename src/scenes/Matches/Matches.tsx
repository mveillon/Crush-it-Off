import React, { useEffect, useState } from "react"

import Header from "../../components/Header/Header"
import CheckLoggedIn from "../../firebase/CheckLoggedIn"
import { useLocation } from "react-router-dom"
import getUserID from "../../firebase/getUserID"
import { firebaseDB } from "../../firebase/init"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { LOBBIES, USERS, userLink, userT } from "../../firebase/dbStructure"
import genericConverter from "../../firebase/genericConverter"
import Match from "../../components/Match/Match"

import "./matches.css"
import "../../global.css"

function Matches() {
  const location = useLocation()
  const {
    lobbyID
  } = location.state as { lobbyID: number }

  const db = firebaseDB()
  const [matches, setMatches] = useState<string[]>([])
  const [doneQuerying, setDoneQuerying] = useState(false)
  const [admirers, setAdmirers] = useState(0)
  const [noCrushes, setNoCrushes] = useState(false)

  const getCrushes = async (uid: string): Promise<string[]> => {
    const memberDoc = doc(
      db,
      LOBBIES,
      lobbyID.toString(),
      "users",
      uid
    ).withConverter(genericConverter<userLink>())

    const memberSnap = await getDoc(memberDoc)
    if (memberSnap.exists()) {
      return memberSnap.data().crushes
    }
    throw new Error(`Cannot resolve user ${uid} in lobby ${lobbyID}`)
  }

  const getAdmirers = async (userID: string): Promise<number> => {
    const lobbyRef = collection(
      db,
      LOBBIES,
      lobbyID.toString(),
      "users"
    ).withConverter(genericConverter<userLink>())

    const allMemberSnaps = await getDocs(lobbyRef)
    let admirerCount = 0
    for (const memSnap of allMemberSnaps.docs) {
      if (memSnap.data().crushes.includes(userID)) {
        admirerCount++
      }
    }

    return admirerCount
  }

  const getName = async (uid: string): Promise<string> => {
    const memberDoc = doc(
      db,
      USERS,
      uid
    ).withConverter(genericConverter<userT>())

    const memberSnap = await getDoc(memberDoc)
    if (memberSnap.exists()) {
      return memberSnap.data().name
    } else {
      throw new Error(`Cannot resolve user with ID ${uid} in lobby ${lobbyID}`)
    }
  }

  const getMatches = async (userID: string, userCrushes: string[]): Promise<string[]> => {
    const crushGetters: Promise<string[]>[] = []
    for (const crushID of userCrushes) {
      crushGetters.push(getCrushes(crushID))
    }

    const crushCrushes = await Promise.all(crushGetters)
    const matchIDs: string[] = []

    for (let i = 0; i < crushCrushes.length; i++) {
      if (crushCrushes[i].includes(userID)) {
        matchIDs.push(userCrushes[i])
      }
    }

    return matchIDs
  }

  useEffect(() => {
    (async () => {
      const userID = getUserID()
      const userCrushes = await getCrushes(userID)
      const matchIDs = await getMatches(userID, userCrushes)

      if (userCrushes.length > 0 && matchIDs.length === 0) {
        setAdmirers(await getAdmirers(userID))

      } else if (userCrushes.length === 0) {
        setNoCrushes(true)

      } else {
        const nameGetters: Promise<string>[] = []

        for (const crushID of matchIDs) {
          nameGetters.push(getName(crushID))
        }

        setMatches(await Promise.all(nameGetters))
      }
      
      setDoneQuerying(true)
    })()
  }, [])

  const numMatches = (): string => {
    const start = 'You have'
    const es = matches.length === 1 ? '' : 'es'
    return `${start} ${matches.length} match${es}!`
  }
  
  const numAdmirers = (): string => {
    const start = '(On the bright side, you do have'
    const s = admirers === 1 ? '' : 's'
    return `${start} ${admirers} secret admirer${s} 🤫)`
  }

  return (
    <div>
      <CheckLoggedIn redirectBack="/matches" />
      <Header />

      <h1 className="title">Your matches:</h1>

      <div className="content">
        {
          matches.map((name, i) => {
            return (
              <Match name={name} key={i} />
            )
          })
        }

        {
          doneQuerying &&
          <div className="num-matches">
            <h2>
              {numMatches()}
            </h2>

            {
              admirers > 0 &&
              <p>
                {numAdmirers()}
              </p>
            }

            {
              noCrushes &&
              <p>
                You can't get any matches if you don't select any crushes.
              </p>
            }
          </div>
        }
      </div>
    </div>
  )
}

export default Matches
