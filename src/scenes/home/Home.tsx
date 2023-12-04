import React from "react";

import CheckLoggedIn from "../../firebase/CheckLoggedIn";
import Header from "../../components/Header/Header";
import NewLobby from "../../components/NewLobby/NewLobby";
import JoinLobby from "../../components/JoinLobby/JoinLobby";
import EditProfileNav from "../../components/EditProfileNav/EditProfileNav";

import "../../global.css"
import "./home.css"

function Home() {
  return (
    <div>
      <CheckLoggedIn redirectBack="/" />
      <Header />

      <div className='content'>
        <div className='home'>
          <NewLobby />
          <JoinLobby />
          <EditProfileNav />
        </div>
      </div>
    </div>
  )
}

export default Home