import React from "react";
import { useNavigate } from "react-router-dom";

import "./hamburger-dropdown.css"
import "../../global.css"

function HamburgerDropdown(props: { style: {display: string }}) {
  const navigate = useNavigate()
  const toEditProfile = () => {
    navigate(
      "/edit-profile",
      { state: { redirectBack: "/" } }
    )
  }

  return (
    <div className="dropdown" style={props.style}>
      <button onClick={toEditProfile}>
        Edit Profile
      </button>
    </div>
  )
}

export default HamburgerDropdown
