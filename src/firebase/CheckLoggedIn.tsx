import React, { useEffect } from "react";
import { 
  getAuth, 
  onAuthStateChanged
} from "firebase/auth";
import { firebaseDB } from "./init";
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { USERS, userT } from "./dbStructure";
import genericConverter from "./genericConverter";

/**
 * Checks that the user is logged in. If they are, saves their uid to
 * local storage. Otherwise, logs the user back in then redirects them
 * back to whatever page they were before
 * @param redirectBack where to send the user after they log in
 */
function CheckLoggedIn(props: { 
  redirectBack: string,
  state?: any
}) {
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
            // need to check if any users in the DB have the same phone
            const userColl = (
              collection(db, USERS).withConverter(genericConverter<userT>())
            )

            const samePhoneQ = query(userColl, where("email", "==", user.phoneNumber))
            getDocs(samePhoneQ).then(samePhoneSnap => {
              const users = samePhoneSnap.docs
              if (users.length > 0) {
                localStorage.setItem("userID", users[0].id)
              } else {
                navigate(
                  "/edit-profile",
                  { state: {...props, phoneNo: user.phoneNumber} }
                )
              }
            })
          }
        })

      } else {
        navigate(
          "/sign-up",
          { state: { props } }
        )
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
