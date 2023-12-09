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
            Gather your friends together and have them join the lobby you create. Everyone will secretly select who they have a crush on. 
          </p>

          <p>
            If your crush selects you, you two will match and you can do with that information what you will 😏
          </p>

          <p>
            If they don't select you, no one will know but you, and you can keep going as if nothing ever happened.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home