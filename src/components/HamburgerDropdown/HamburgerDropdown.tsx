import React from "react";
import { redirect, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

import "./hamburger-dropdown.css";
import "../../global.css";

function HamburgerDropdown(props: { style: {display: string }}) {
  const navigate = useNavigate()
  const toEditProfile = () => {
    navigate(
      "/edit-profile",
      { state: { redirectBack: "/" } }
    )
  }

  const signUserOut = () => {
    const auth = getAuth()
    signOut(auth).then(() => {
      navigate(
        "/sign-up",
        { state: { redirectBack: "/home" } }
      )
    })
  }

  return (
    <div className="dropdown" style={props.style}>
      <div className="buttons">
        <button 
          onClick={() => navigate("/home")}
          className="burger-button"
        >
          Home
        </button>

        <button 
          onClick={toEditProfile}
          className="burger-button"
        >
          Edit Profile
        </button>

        <button 
          onClick={signUserOut}
          className="burger-button"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default HamburgerDropdown
