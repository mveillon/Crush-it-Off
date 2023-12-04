import React from "react";
import { useNavigate } from "react-router-dom";

import "./edit-profile-nav.css"
import "../../global.css"

function EditProfileNav() {
  const navigate = useNavigate()
  const toEditProfile = () => {
    navigate(
      "/edit-profile",
      { state: { redirectBack: "/" } }
    )
  }

  return (
    <div>
      <button onClick={toEditProfile}>Edit Profile</button>
    </div>
  )
}

export default EditProfileNav
