import React from "react";

import "../../global.css"
import "./home.css"
import CheckLoggedIn from "../../firebase/CheckLoggedIn";
import Header from "../../components/Header/Header";
import NewLobby from "../../components/NewLobby/NewLobby";
import JoinLobby from "../../components/JoinLobby/JoinLobby";

function Home() {
  return (
    <div>
      <CheckLoggedIn redirectBack="/" />
      <Header />

      <div className='content'>
        <div className='home'>
          <NewLobby />
          <JoinLobby />
        </div>
      </div>
    </div>
  )
}

export default Home