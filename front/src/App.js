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
  PutSetting,
  Guide,
  ARCanvas
} from "./pages";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainFeed />} />
        <Route path="/search" element={<Search />} />
        <Route path="/detail/:art_pk" element={<DetailPage />} />
        <Route path="/guide/:art_pk" element={<Guide />} />
        <Route path="/ar/:art_pk" element={<ARCanvas />} />
        <Route path="/test" element={<ArtistProfile />} />
        <Route path="/following/:page/:user_pk" element={<FollowingPage />} />
        <Route path="/auction/:art_pk" element={<AuctionPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<SettingPage />} />
        <Route path="/postArt" element={<Register />} />
        <Route path="/salesHistory" element={<SaleHistory />} />
        <Route path="/purchaseHistory" element={<PurchaseHistory />} />
        <Route path="/putArt/:art_pk" element={<PutRegister />} />
        <Route path="/info" element={<Info />} />
        <Route path="/putCreate" element={<PutSetting />} />
        <Route path="/artist/:user_pk" element={<ArtistProfile />} />
      </Routes>
    </Router>
  );
}
