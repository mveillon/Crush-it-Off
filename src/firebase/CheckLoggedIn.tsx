import React, { useEffect } from "react";
import { 
  getAuth, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithRedirect
} from "firebase/auth";
import { firebaseDB } from "./init";
import { getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { USERS } from "./dbStructure";

/**
 * Checks that the user is logged in. If they are, saves their uid to
 * local storage. Otherwise, logs the user back in then redirects them
 * back to whatever page they were before
 * @param redirectBack where to send the user after they log in
 */
function CheckLoggedIn(props: { redirectBack: string }) {
  const navigate = useNavigate()

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, user => {
      if (user) {
        localStorage.setItem("userID", user.uid)
  
        const db = firebaseDB()
        getDoc(doc(db, USERS, user.uid)).then(snapshot => {
          if (snapshot.exists()) {
            // user is already in Firebase so we're chilling
          } else {
            navigate(
              "/create-profile",
              { state: { redirectBack: props.redirectBack } }
            )
          }
        })
        
      } else {
        const auth = getAuth()
        const provider = new GoogleAuthProvider()
        signInWithRedirect(auth, provider)
      }
    })
  }, [])
  
  // needs to be a React component to allow for useNavigate usage
  // bit hacky but oh well
  return (
    <></>
  )
}

export default CheckLoggedIn
