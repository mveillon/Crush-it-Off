import React from "react";

import CheckLoggedIn from "../../firebase/CheckLoggedIn";
import Header from "../../components/Header/Header";
import NewLobby from "../../components/NewLobby/NewLobby";
import JoinLobby from "../../components/JoinLobby/JoinLobby";

import "../../global.css"
import "./home.css"

function Home() {
  return (
    <div>
      <CheckLoggedIn redirectBack="/home" />
      <Header />

      <div className='content'>
        <div className='redirects'>
          <NewLobby />
          <JoinLobby />
        </div>

        <div className="explanation">
          <p>
            If you have ever wondered if your crush likes you back but been too afraid to ask, then look no further! Crushers is a web app designed to answer that very question!
          </p>

          <p>
            Crushers is a party game designed to be played together with friends. To get started, have one person create a lobby and have everyone else join that same lobby.
          </p>

          <p>
            Once you are in the lobby, you will be able to secretly select who among your friends you have a crush on. If your crush also selects you, the two of you will match and you will know you should start dating!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home