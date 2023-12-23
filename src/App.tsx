import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './scenes/Home/Home';
import EditProfile from './scenes/EditProfile/EditProfile';
import Lobby from './scenes/Lobby/Lobby';
import Matches from './scenes/Matches/Matches';
import WaitingRoom from './scenes/WaitingRoom/WaitingRoom';
import SignUp from './scenes/SignUp/SignUp';
import ResetPassword from './scenes/ResetPassword/ResetPassword';
import Explanation from './scenes/Explanation/Explanation';
import PageNotFound from './scenes/PageNotFound/PageNotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<Home />} />

        <Route path={"/home"} element={<Home />} />

        <Route path="/edit-profile" element={<EditProfile />} />

        <Route path="/lobby" element={<Lobby />} />

        <Route path="/waiting-room" element={<WaitingRoom />} />

        <Route path="/matches" element={<Matches />} />

        <Route path="/sign-up" element={<SignUp />} />

        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/explanation" element={<Explanation />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
