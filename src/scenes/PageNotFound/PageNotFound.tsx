import React from "react";

import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";

import "./page-not-found.css";
import "../../global.css";

function PageNotFound() {
  const navigate = useNavigate()

  return (
    <div>
      <Header />

      <h1 className="title">How Did You Get Here?</h1>

      <div className="content">
        <p>
          Page not found. Push this button to go back to the home page.
        </p>

        <button onClick={() => { navigate("/") }}>Go Home</button>
      </div>
    </div>
  )
}

export default PageNotFound