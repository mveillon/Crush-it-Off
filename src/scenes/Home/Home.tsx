import React from "react";

import { Link } from "react-router-dom";
import CheckLoggedIn from "../../firebase/CheckLoggedIn";
import Header from "../../components/Header/Header";
import NewLobby from "../../components/NewLobby/NewLobby";
import JoinLobby from "../../components/JoinLobby/JoinLobby";

import "../../global.css"
import "./home.css"
import Collapsible from "../../components/Collapsible/Collapsible";

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

        <div className="home-info">
          <Collapsible title="How Does it Work?">
            <p>
              Gather your friends together and have them join the lobby you create. Everyone will secretly select who they would want to go on a date with. 
            </p>

            <p>
              If the person you select also selects you, the two of you will match and you can do with that information what you will 😏
            </p>

            <p>
              If they don't select you, no one will know but you, and you can keep going as if nothing ever happened. Confused? 
              <Link to="/explanation" className="inline-link">Read more.</Link>
            </p>
          </Collapsible>
        </div>
      </div>
    </div>
  )
}

export default Home