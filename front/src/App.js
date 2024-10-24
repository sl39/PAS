import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  ArtistProfile,
  MainFeed,
  Search,
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
  PutSetting,
  Guide,
  ARCanvas,
} from "./pages";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainFeed />} />
        <Route path="/search" element={<Search />} />
        <Route path="/detail/:art_pk/:user_pk" element={<DetailPage />} />
        <Route path="/guide/:art_pk" element={<Guide />} />
        <Route path="/ar/:art_pk" element={<ARCanvas />} />
        <Route path="/test" element={<ArtistProfile />} />
        <Route path="/following/:page/:user_pk" element={<FollowingPage />} />
        <Route path="/auction/:art_pk/:user_pk" element={<AuctionPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create/:user_pk" element={<SettingPage />} />
        <Route path="/postArt/:user_pk" element={<Register />} />
        <Route path="/salesHistory/:user_pk" element={<SaleHistory />} />
        <Route path="/purchaseHistory/:user_pk" element={<PurchaseHistory />} />
        <Route path="/putArt/:art_pk" element={<PutRegister />} />
        <Route path="/info/:user_pk" element={<Info />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/putCreate/:user_pk" element={<PutSetting />} />
        <Route path="/artist/:user_pk" element={<ArtistProfile />} />
      </Routes>
    </Router>
  );
}
