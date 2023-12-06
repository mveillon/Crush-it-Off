import React, { ChangeEvent, useEffect, useMemo, useState} from "react";

import Header from "../../components/Header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { firebaseDB } from "../../firebase/init";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { any } from "../../utils/numJS";
import { USERS, userT, PFPs } from "../../firebase/dbStructure";
import genericConverter from "../../firebase/genericConverter";
import getUserID from "../../firebase/getUserID";
import Resizer from "react-image-file-resizer";

import "./edit-profile.css";
import "../../global.css";

function EditProfile() {
  const location = useLocation()
  const {
    redirectBack,
    email
  } = location.state as { 
    redirectBack: string, 
    email?: string, 
  }

  const defaultPFP = "pfp-default.png"

  const [user, setUser] = useState<userT>({
    name: "",
    gender: "Male",
    email: "",
    "profile-pic": defaultPFP,
    preferences: [false, false, false]
  })

  const [invalidInput, setInvalidInput] = useState(false)
  const [pfpURL, setPfpURL] = useState('')
  const [uploadedImage, setUploadedImage] = useState(false)

  const userRef = useMemo(() => {
    const db = firebaseDB()
    const uid = getUserID()
    return doc(db, `${USERS}/${uid}`).withConverter(genericConverter<userT>())
  }, [])

  const storage = getStorage()

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

  const uploadPFP = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files != null) {
      setUploadedImage(true)
      const url = URL.createObjectURL(e.target.files[0])
      setPfpURL(url)
      setUser({...user, "profile-pic": url})
    }
  }

  const navigate = useNavigate()
  const saveChanges = () => {
    const valid = (
      user.name.length > 0 &&
      user.gender.length > 0 &&
      any(user.preferences)
    )

    if (valid) {
      if (uploadedImage) {
        fetch(pfpURL)
          .then(res => res.blob())
          .then(blob => {
            (new Promise((resolve) => {
              Resizer.imageFileResizer(
                blob,
                360,
                360,
                "JPEG",
                100,
                0,
                (blob) => { resolve(blob) },
                "blob"
              )
            }))
            .then(blob => {
              let fileName = userRef.id
              const blobType = (blob as Blob).type
              const extns: { [index: string]: string } = {
                "image/png": "png",
                "image/jpeg": "jpeg",
                "image/gif": "gif"
              }
              if (blobType in extns) {
                fileName = `${fileName}.${extns[blobType]}`
              }

              const imgRef = ref(storage, `${PFPs}/${fileName}`)
              uploadBytes(imgRef, blob as Blob).then(_ => {
                setDoc(userRef, {...user, "profile-pic": fileName})
                navigate(
                  "/home"
                )
              })
            })
          })
      } else {
        setDoc(userRef, user)
        navigate(
          "/home"
        )
      }
    } else {
      setInvalidInput(true)
    }
  }

  useEffect(() => {
    getDoc(userRef).then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.data()
        setUser(data)

        const pfpRef = ref(storage, `${PFPs}/${data["profile-pic"]}`)
        getDownloadURL(pfpRef).then(url => {
          setPfpURL(url)
        })

      } else {
        const pfpRef = ref(storage, `${PFPs}/${user["profile-pic"]}`)
        getDownloadURL(pfpRef).then(url => {
          setPfpURL(url)
        })

        if (typeof email === 'undefined') {
          throw new Error(`Email undefined for user ${userRef.id}`)
        }
        setUser({...user, email: email})
      }
    })
  }, [])

  return (
    <div>
      <Header />

      <div className="content">
        <h1 className="title">
          We just need to gather some information about you
        </h1>

        <div className="edit-profile">
          <form>
            <label>Enter your name:
              <input
                type="text"
                value={user.name}
                onChange={(e) => changeName(e.target.value)}
              />
            </label>

            <label>Upload a picture of yourself (optional):
              <input
                type="file"
                accept="image/*"
                onChange={uploadPFP}
                className="pfp-input"
              />
            </label>
            <img 
              src={pfpURL} 
              height={360} 
              width={360} 
              className="pfp" 
              alt="Your profile"
            />

            <label>Select your gender identity:
              <select 
                onChange={(e) => changeGender(e.target.value)}
                className="gender-select"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Gender Fluid">Gender Fluid</option>
                <option value="Prefer not to say">Prefer Not to Say</option>
              </select>
            </label>

            <label className="prefs">Select your dating preferences:
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
