import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ArtistProfile, MainFeed, Search } from "./pages";
import { SearchFilter } from "./components";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainFeed />} />
        <Route path="/search" element={<Search />} />
        <Route path="/test" element={<SearchFilter />} />
      </Routes>
    </Router>
  );
}
