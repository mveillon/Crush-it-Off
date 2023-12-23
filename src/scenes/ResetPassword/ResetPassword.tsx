import React, { FormEvent, useState } from "react";

import Header from "../../components/Header/Header";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import "./reset-password.css";
import "../../global.css";

function ResetPassword() {
  const [email, setEmail] = useState('')
  const [invalid, setInvalid] = useState(false)

  const navigate = useNavigate()
  const sendEmail = (e: FormEvent) => {
    e.preventDefault()
    const auth = getAuth()
    sendPasswordResetEmail(auth, email)
      .then(() => {
        navigate("/home")
      })
      .catch(error => {
        console.log(error.message)
        setInvalid(true)
      })
  }

  return (
    <div>
      <Header />
      <h1 className="title">Reset Your Password</h1>

      <div className="content">
        <form onSubmit={sendEmail}>
          <label>Enter your email:
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value)} }
              autoFocus={true}
            />
          </label>

          <input type="submit" value="Send password reset email" />
        </form>

        {
          invalid &&
          <p>Please input a vaild email</p>
        }
      </div>
    </div>
  )
}

export default ResetPassword
