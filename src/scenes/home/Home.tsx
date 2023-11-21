import React from "react";

import "../../global.css"
import "./home.css"
import Header from "../../components/header/Header";
import { firebaseApp } from "../../firebase/init";

function Home() {
  return (
    <div>
      <Header />
    </div>
  )
}

export default Home