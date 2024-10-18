import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ArtistProfile, MainFeed, Search, ARCanvas, DetailPage, FollowingPage } from "./pages";

export default function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainFeed />} />
        <Route path="/search" element={<Search />} />
        <Route path="/detail/:art_pk/:user_pk" element={<DetailPage />} />
        <Route path="/AR/:art_pk" element={<ARCanvas />} />
        <Route path="/test" element={<ArtistProfile />} />
        <Route path="/following/:page" element={<FollowingPage />} />
      </Routes>
    </Router>
  );
}
