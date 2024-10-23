import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ArtistProfile,
  MainFeed,
  Search,
  ARCanvas,
  DetailPage,
  FollowingPage,
  AuctionPage,
  Login,
  SettingPage,
  Info,
  Register,
  PurchaseHistory,
  SaleHistory,
  PutRegister,
  Receipt,
} from "./pages";
import { SearchFilter } from "./components";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainFeed />} />
        <Route path="/search" element={<Search />} />
        <Route path="/detail/:art_pk/:user_pk" element={<DetailPage />} />
        <Route path="/AR/:art_pk" element={<ARCanvas />} />
        <Route path="/following/:page" element={<FollowingPage />} />
        <Route path="/auction/:art_pk/:user_pk" element={<AuctionPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<SettingPage />} />
        <Route path="/postArt" element={<Register />} />
        <Route path="/salesHistory" element={<SaleHistory />} />
        <Route path="/purchaseHistory" element={<PurchaseHistory />} />
        <Route path="/putRegister" element={<PutRegister />} />
        <Route path="/info" element={<Info />} />
        <Route path="/reciept" element={<Receipt />} />
        <Route path="/artist/:artist_pk" element={<ArtistProfile />} />
        <Route path="/test" element={<SearchFilter />} />
      </Routes>
    </Router>
  );
}
