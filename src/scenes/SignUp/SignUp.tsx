import React from "react";

import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import CreateAccount from "../../components/CreateAccount/CreateAccount";
import Login from "../../components/Login/Login";

import "./sign-up.css";
import "../../global.css";

function SignUp() {
  const location = useLocation()
  const {
    redirectBack,
    state
  } = location.state as { redirectBack: string, state?: any }

  return (
    <div>
      <Header />
      <h1 className="title">Sign up to use Crush it Off</h1>

      <div className="content sign-up">
        <CreateAccount state={state} />

        <Login redirectBack={redirectBack} state={state} />
      </div>
    </div>
  )
}

export default SignUp