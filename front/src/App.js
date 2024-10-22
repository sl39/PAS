import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Login, SettingPage, Info, Register, PurchaseHistory, SaleHistory, PutRegister, Receipt} from "./pages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<SettingPage />} />
        <Route path="/postArt" element={<Register />} />
        <Route path="/salesHistory" element={<SaleHistory />} />
        <Route path="/purchaseHistory" element={<PurchaseHistory />} />
        <Route path="/putRegister" element={<PutRegister />} />
        <Route path="/info" element={<Info />} />
        <Route path="/reciept" element={<Receipt />} />
      </Routes>
    </BrowserRouter>
  );
}
//style={{maxWidth: '1000px', margin: 'auto'}}