import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './scenes/Home/Home';
import EditProfile from './scenes/EditProfile/EditProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/create-profile" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
