import React, { useState } from "react";

import logo from "../../assets/logo.png";
import hamburger from "../../assets/hamburger-button.jpg";

import "../../global.css"
import "./header.css"
import { useNavigate } from "react-router-dom";
import HamburgerDropdown from "../HamburgerDropdown/HamburgerDropdown";

function Header() {

  const [dispDropdown, setDispDropdown] = useState(false)
  
  const navigate = useNavigate()
  const toHome = () => {
    navigate("/")
  }

  const getDropdownStyle = () => (
    dispDropdown ? {display: "block"} : {display: "none"}
  )

  return (
    <div className="header">
      <img className="logo" src={logo} alt="logo" onClick={toHome} />

      <h1>CRUSHERS</h1>

      <div className="hamburger-div">
        <img 
          className="logo hamburger" 
          src={hamburger} 
          alt="hamburger"
          onClick={() => { setDispDropdown(!dispDropdown) }}
        />

        <HamburgerDropdown style={getDropdownStyle()} />
      </div>
    </div>
  )
}

export default Header
