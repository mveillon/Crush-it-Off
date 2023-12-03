import React from "react";

import Header from "../../components/Header/Header";
import CheckLoggedIn from "../../firebase/CheckLoggedIn";
import "./matches.css"
import "../../global.css"

function Matches() {
  return (
    <div>
      <CheckLoggedIn redirectBack="/matches" />
      <Header />

      <div className="content">
        <h2>Your matches:</h2>
      </div>
    </div>
  )
}

export default Matches
