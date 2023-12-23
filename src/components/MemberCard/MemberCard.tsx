import React from "react";

import Checkbox from "../Checkbox/Checkbox";

import "./member-card.css"
import "../../global.css"

function MemberCard(props: {
  name: string, 
  pfpUrl: string, 
  checked: boolean,
  onCheck: () => void
}) {
  return (
    <div className="member-card">
      <img 
        src={props.pfpUrl} 
        className="lobby-pfp" 
        alt={`${props.name}'s profile`} 
      />
      
      <p>{props.name}</p>

      <Checkbox checked={props.checked} onClick={props.onCheck} />
    </div>
  )
}

export default MemberCard
