import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainFeed from "./pages/MainFeed";
import Search from "./pages/Search";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainFeed />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}
