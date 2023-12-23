import React from "react";

import Header from "../../components/Header/Header";

import exampleLobbyUnchecked from "../../assets/example-lobby-unchecked.png";
import exampleLobbyChecked from "../../assets/example-lobby-checked.png";
import exampleMatch from "../../assets/example-match.png";

import "./explanation.css";
import "../../global.css";

function Explanation() {
  return (
    <div>
      <Header />

      <div className="content">
        <h1 className="title">How it Works</h1>

        <div className="explanation">
          <p>
            Who here has ever had a crush on a friend but has been too afraid to ask them out? 🙋‍♀️
          </p>

          <p>
            Maybe it's because we're afraid of rejection, embarassment, making them uncomfortable, or of making things weird.
          </p>

          <p>
            Whatever it is, Crush it Off is designed to avoid all of that while still finding out whether the person you're interested in likes you back.
          </p>

          <p>
            So how do you use it? First, get everything set up by having everyone make a profile and join your lobby.
          </p>

          <p>
            One thing that makes Crush it Off different from other dating apps is that you will NOT see any strangers. Only people who have your lobby code (i.e. the friends you share it with) will be in the lobby.
          </p>

          <p>
            Once everyone's in the lobby, it should look something like this. 
          </p>

          <img
            src={exampleLobbyUnchecked}
            className="example-img"
          />

          <p>
            (Note that, whenever when we say "crush," we have a pretty inclusive definition. We consider a crush to just mean you would want to go on a date with them if they asked you out, or you would be willing to ask them out if you knew they would say yes.)
          </p>

          <p>
            Let's say you have a crush on Barbara. In this case, you would just check off her name!
          </p>

          <img
            src={exampleLobbyChecked}
            className="example-img"
          />

          <p> 
            Click the "Submit Selections" buttons, and wait for everyone else to submit theirs as well!
          </p>

          <p>
            If Barbara also selected your name, you two will match!
          </p>

          <img
            src={exampleMatch}
            className="example-img"
          />

          <p>
            If Barbara didn't select your name, it may be disappointing, but at least you know. 
          </p>

          <p>
            Most importantly, she won't know that you selected her name unless you tell her! That means no rejection, no embarassment, nothing gets weird, and you can keep being friends as if nothing happened!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Explanation
