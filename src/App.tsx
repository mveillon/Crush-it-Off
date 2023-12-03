import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './scenes/Home/Home';
import EditProfile from './scenes/EditProfile/EditProfile';
import Lobby from './scenes/Lobby/Lobby';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/edit-profile" element={<EditProfile />} />

        <Route path="/lobby" element={<Lobby />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
