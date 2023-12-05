import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { 
  ConfirmationResult, 
  RecaptchaVerifier, 
  getAuth, 
  signInWithPhoneNumber
} from "firebase/auth";

import "./sign-up.css";
import "../../global.css";
import Header from "../../components/Header/Header";

function SignUp() {
  const location = useLocation()

  const [phone, setPhone] = useState('')
  const [invalidNumber, setInvalidNumber] = useState(false)

  const [verifyNo, setVerifyNo] = useState('')
  const [confirmRes, setConfirmRes] = (
    useState<ConfirmationResult | undefined>(undefined)
  )
  const [verifyFailed, setVerifyFailed] = useState(false)

  // from https://ihateregex.io/expr/phone/
  // don't ask me to explain it jesus christ
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gmi

  const navigate = useNavigate()

  const verifyNumber = async () => {
    if (!phoneRegex.test(phone)) {
      setInvalidNumber(true)
    } else {
      const auth = getAuth()
      const captcha = new RecaptchaVerifier(auth, 'sign-in-button', {
        size: 'invisible'
      })
      await captcha.render()

      signInWithPhoneNumber(auth, phone, captcha)
        .then(confirmation => {
          setConfirmRes(confirmation)
        })
        .catch(error => {
          setInvalidNumber(true)
          console.log(error)
        })
    }
  }

  const submitVerificationCode = () => {
    if (typeof confirmRes === 'undefined') {
      throw new Error('Submitted verification code before allowed')
    }

    confirmRes.confirm(verifyNo)
      .then(result => {
        const user = result.user
        localStorage.setItem("userID", user.uid)

        navigate(
          "/edit-profile",
          { state: {...location.state, phone: user.phoneNumber}}
        )
      })
      .catch(_ => {
        setVerifyFailed(true)

      })
  }

  return (
    <div>
      <Header />
      <div className="content">
        <h1 className="title">Sign up to use Crushers</h1>

        <div className="sign-up">
          <div className="numbers">
            <div className="number-section">
              <label>Enter your phone number: 
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={typeof confirmRes !== 'undefined'}
                />
              </label>

              {
                invalidNumber &&
                <p>Please input a valid phone number</p>
              }

              <button 
                onClick={verifyNumber}
                disabled={typeof confirmRes !== 'undefined'}
              >
                Verify number
              </button>
            </div>
            
            <div className="number-section">
              <label>Confirmation code: 
                <input
                  type="text"
                  value={verifyNo}
                  onChange={(e) => setVerifyNo(e.target.value)}
                  disabled={typeof confirmRes === 'undefined'}
                />
              </label>

              <button 
                onClick={submitVerificationCode}
                disabled={typeof confirmRes === 'undefined'}
              >
                Submit Code
              </button>

              {
                verifyFailed &&
                <p>Could not verify code. Please refresh and try again.</p>
              }
            </div>
          </div>

          <p>
            You may receive a verification message. Standard messaging rates will apply. I'm not a lawyer please don't sue me.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp