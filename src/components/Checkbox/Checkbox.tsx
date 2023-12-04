import React, { useState } from "react";

import checked from "../../assets/checkbox-checked.png";
import unchecked from "../../assets/checkbox-unchecked.png";

import "./checkbox.css";
import "../../global.css"

function Checkbox(props: {checked: boolean, onClick: () => void}) {
  const [isChecked, setChecked] = useState(props.checked)

  const imgSrc = () => {
    return isChecked ? checked : unchecked
  }

  const clickBox = () => {
    setChecked(!isChecked)
    props.onClick()
  }

  return (
    <img 
      src={imgSrc()}
      className="checkbox"
      onClick={clickBox}
    />
  )
}

export default Checkbox
