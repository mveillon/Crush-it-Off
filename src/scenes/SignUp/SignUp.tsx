import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import { baseURL, firebaseDB } from "../../firebase/init";
import { getAuth, sendSignInLinkToEmail, signInWithEmailLink } from "firebase/auth";
import { collection, doc } from "firebase/firestore";
import { USERS } from "../../firebase/dbStructure";

import "./sign-up.css";
import "../../global.css";

function SignUp() {
  const {
    redirectback,
    verified
  } = useParams() as { redirectback: string, verified: string }

  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const emailCookie = "userEmail"
  const navigate = useNavigate()
  useEffect(() => {
    if (verified === '1') {
      const email = localStorage.getItem(emailCookie)
      if (email === null) {
        throw new Error('Cannot retrieve email from cookies!')
      }
      
      const auth = getAuth()
      signInWithEmailLink(auth, email, window.location.href).then(result => {
        localStorage.removeItem(emailCookie)
        localStorage.setItem("userID", result.user.uid)

        navigate(
          "/edit-profile",
          { state: { redirectBack: redirectback, email } }
        )
      })
    }
  }, [])

  const verifyEmail = () => {
    let domain = `https://${baseURL()}`
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      domain = 'http://localhost:3000'
    }
    
    const url = `${domain}/sign-up/${redirectback}/1`
    console.log(url)
    const actionCodeSettings = {
      url: url,
      handleCodeInApp: true
    }

    const auth = getAuth()
    sendSignInLinkToEmail(auth, email, actionCodeSettings).then(() => {
      localStorage.setItem(emailCookie, email)
      setEmailSent(true)
    })
  }

  return (
    <div>
      <Header />
      <div className="content">
        <h1 className="title">Sign up to use Crushers</h1>

        <div className="sign-up">
          <div className="email-input">
            <label>Enter your email: 
              <input 
                type="text" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="email-box"
              />
            </label>

            <button 
              onClick={verifyEmail}
            >
              Verify email
            </button>

            {
              emailSent &&
              <p>Verification link sent. Check your email!</p>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp