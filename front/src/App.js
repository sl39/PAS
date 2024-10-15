import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainFeed from "./pages/MainFeed";
import Search from "./pages/Search";
import ARCanvas from "./components/ARCanvas";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainFeed />} />
        <Route path="/search" element={<Search />} />
        <Route path="/AR" element={<ARCanvas/>}/>
      </Routes>
    </Router>
  );
}
