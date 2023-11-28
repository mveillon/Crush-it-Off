import React, { useEffect, useMemo, useState} from "react";

import Header from "../../components/Header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { firebaseDB } from "../../firebase/init";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { any } from "../../utils/numJS";
import "../../global.css";
import "./edit-profile.css"
import { USERS, userT } from "../../firebase/dbStructure";
import genericConverter from "../../firebase/genericConverter";

function EditProfile() {
  const location = useLocation()
  const {
    redirectBack
  } = location.state as { redirectBack: string }

  const [user, setUser] = useState({
    name: "",
    gender: "Male",
    preferences: [false, false, false]
  })

  const [invalidInput, setInvalidInput] = useState(false)
  const userRef = useMemo(() => {
    const db = firebaseDB()
    const uid = localStorage.getItem("userID")
    return doc(db, `${USERS}/${uid}`).withConverter(genericConverter<userT>())
  }, [])

  const changeName = (name: string) => {
    setUser({...user, name: name})
  }

  const editGender = (gender: string): string => {
    if (gender === 'Male' || gender === 'Female') {
      return gender
    }
    return 'Non-Binary' // see Gender.ts for why we do this
  }

  const changeGender = (gender: string) => {
    setUser({...user, gender: editGender(gender)})
  }

  const togglePref = (pref: string) => {
    const newPrefs = user.preferences
    if (pref === "Male") {
      newPrefs[0] = !newPrefs[0]
    } else if (pref === "Female") {
      newPrefs[1] = !newPrefs[1]
    } else {
      newPrefs[2] = !newPrefs[2]
    }
    setUser({...user, preferences: newPrefs})
  }

  useEffect(() => {
    getDoc(userRef).then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        setUser({
          name: data.name,
          gender: data.gender,
          preferences: data.preferences
        })
      }
    })
  }, [])

  const navigate = useNavigate()
  const saveChanges = () => {
    const valid = (
      user.name.length > 0 &&
      user.gender.length > 0 &&
      any(user.preferences)
    )

    if (valid) {
      setDoc(userRef, user)
      navigate(redirectBack)
    } else {
      setInvalidInput(true)
    }
  }

  return (
    <div>
      <Header />

      <div className="content">
        <div className="edit-profile">
          <h1>We just need to gather some information about you</h1>

          <form>
            <label>Enter your name:
              <input
                type="text"
                value={user.name}
                onChange={(e) => changeName(e.target.value)}
              />
            </label>

            <label>Select your gender identity:
              <select onChange={(e) => changeGender(e.target.value)}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Gender Fluid">Gender Fluid</option>
                <option value="Prefer not to say">Prefer Not to Say</option>
              </select>
            </label>

            <label>Select your dating preferences:
              <label>Male
                <input
                  type="checkbox"
                  checked={user.preferences[0]}
                  onChange={(e) => togglePref("Male")}
                />
              </label>

              <label>Female
                <input
                  type="checkbox"
                  checked={user.preferences[1]}
                  onChange={(e) => togglePref("Female")}
                />
              </label>

              <label>Non-Binary
                <input
                  type="checkbox"
                  checked={user.preferences[2]}
                  onChange={(e) => togglePref("Non-Binary")}
                />
              </label>
            </label>
          </form>

          <button onClick={saveChanges}>Save Changes</button>

          {
            invalidInput &&
            <h2>Please make sure you've inputted something for every field!</h2>
          }
        </div>
      </div>
    </div>
  )
}

export default EditProfile
