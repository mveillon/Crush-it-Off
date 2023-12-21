import React, { useState } from "react";

import "./collapsible.css";
import "../../global.css";

function Collapsible(props: {
  children?: string | JSX.Element | JSX.Element[],
  title: string
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="collapsible">
      <button 
        className="expand-button"
        onClick={() => { setExpanded(!expanded) }}
      >
        <span></span>
        <span>{props.title}</span>
        <span>v</span>
      </button>

      { 
        expanded &&
        <div 
        className='hidden-content'
        >
          {props.children}
        </div>
      }
    </div>
  )
}

export default Collapsible
