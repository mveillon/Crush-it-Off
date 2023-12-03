import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './scenes/Home/Home';
import EditProfile from './scenes/EditProfile/EditProfile';
import Lobby from './scenes/Lobby/Lobby';
import Matches from './scenes/Matches/Matches';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/edit-profile" element={<EditProfile />} />

        <Route path="/lobby" element={<Lobby />} />

        <Route path="/matches" element={<Matches />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
