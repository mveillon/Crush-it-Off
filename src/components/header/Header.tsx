import React from "react";

import logo from "../../assets/logo.png";
import hamburger from "../../assets/hamburger-button.jpg";

import "../../global.css"
import "./header.css"

function Header() {
  return (
    <div className="header">
      <img className="logo" src={logo} alt="logo" />

      <h1>CRUSHERS</h1>

      <img className="logo hamburger" src={hamburger} alt="hamburger" />
    </div>
  )
}

export default Header
