import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainFeed from "./pages/MainFeed";
import Search from "./pages/Search";
import DetailPage from "./pages/DetailPage";
import ARCanvas from "./pages/ARCanvas";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainFeed />} />
        <Route path="/search" element={<Search />} />
        <Route path="/detail/:art_pk/:user_pk" element={<DetailPage />} />
        <Route path="/AR/:art_pk" element={<ARCanvas />} />
      </Routes>
    </Router>
  );
}
