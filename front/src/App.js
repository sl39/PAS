import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Login, SettingPage, Info, Register, PurchaseHistory, SaleHistory, PutRegister, Receipt, PutSetting} from "./pages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<SettingPage />} />
        <Route path="/postArt/:user_pk" element={<Register />} />
        <Route path="/salesHistory/:user_pk" element={<SaleHistory />} />
        <Route path="/purchaseHistory/:user_pk" element={<PurchaseHistory />} />
        <Route path="/putArt/:art_pk" element={<PutRegister />} />
        <Route path="/info/:user:pk" element={<Info />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/putCreate/:user_pk" element={<PutSetting />} />
      </Routes>
    </BrowserRouter>
  );
}