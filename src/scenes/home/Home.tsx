import React from "react";

import "../../global.css"
import "./home.css"
import Header from "../../components/Header/Header";
import NewLobby from "../../components/NewLobby/NewLobby";
import checkLoggedIn from "../../firebase/checkLoggedIn";

function Home() {
  checkLoggedIn()

  return (
    <div>
      <Header />

      <div className='content'>
        <div className='home'>
          <NewLobby />
        </div>
      </div>
    </div>
  )
}

export default Home