import React, { useEffect, useState } from "react";
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

declare const grecaptcha: any;

function SignUp() {
  const location = useLocation()

  const [phone, setPhone] = useState('')
  const [invalidNumber, setInvalidNumber] = useState(false)

  const [verifyNo, setVerifyNo] = useState('')
  const [confirmRes, setConfirmRes] = (
    useState<ConfirmationResult | undefined>(undefined)
  )
  const [verifyFailed, setVerifyFailed] = useState(false)

  const [captcha, setCaptcha] = useState<RecaptchaVerifier>()
  const [captchaID, setCaptchaID] = useState(NaN)

  useEffect(() => {
    let triedAlready = false
    const renderCaptcha = async (): Promise<() => void> => {
      try {
        const auth = getAuth()
        const c = new RecaptchaVerifier(auth, 'sign-in-button', {
          size: 'invisible'
        })

        const cID = await c.render()
        setCaptcha(c)
        setCaptchaID(cID)
        return () => {
          c.clear()
          grecaptcha.reset(cID)
        }

      } catch (e) {
        if (!triedAlready) {
          triedAlready = true

          return new Promise((resolve, _) => {
            setTimeout(() => {
              resolve(renderCaptcha)
            }, 2000)
          })
        } else {
          throw e
        }
      }
      
    }
    const callbackPromise = renderCaptcha()

    return () => { callbackPromise.then(f => f()) }
  }, [])

  // from https://ihateregex.io/expr/phone/
  // don't ask me to explain it jesus christ
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/gmi

  const navigate = useNavigate()

  const verifyNumber = async () => {
    if (!phoneRegex.test(phone)) {
      setInvalidNumber(true)
    } else {
      const auth = getAuth()
      if (typeof captcha === "undefined") {
        throw new Error('Failed to initialize captcha')
      }

      signInWithPhoneNumber(auth, phone, captcha)
        .then(confirmation => {
          setConfirmRes(confirmation)
        })
        .catch(error => {
          setInvalidNumber(true)
          captcha.clear()
          grecaptcha.reset()
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
        grecaptcha.reset(captchaID)
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
                id="sign-in-button"
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
                <p>Could not verify code. Please try again.</p>
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