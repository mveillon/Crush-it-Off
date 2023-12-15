import React, { useMemo } from "react";

import { choices } from "../../utils/random";

import "./match.css";
import "../../global.css";

function Match(props: {name: string}) {
  const s = useMemo(() => {
    const adjectives = [
      "wonderful",
      "beautiful",
      "magnificent",
      "fabulous",
      "spectacular",
      "gorgeous",
      "majestic",
      "golden",
      "exquisite",
      "enchanting",
      "dazzling",
      "brilliant",
      "breathtaking",
      "marvelous",
      "radiant",
      "opulent",
      "mesmerizing",
      "divine"
    ]
    const toUse = choices(adjectives, 2)
    return `The ${toUse.join(', ')} ${props.name}!`
  }, [])

  return (
    <div className="single-match">
      <p>{s}</p>
    </div>
  )
}

export default Match
