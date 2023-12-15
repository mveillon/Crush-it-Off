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
      <div className="content">
        <h1 className="title">Sign up to use Crushers</h1>

        <div className="sign-up">
          <CreateAccount state={state} />

          <Login redirectBack={redirectBack} state={state} />
        </div>
      </div>
    </div>
  )
}

export default SignUp