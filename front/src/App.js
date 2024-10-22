import Login from "./pages/login";
import SettingPage from "./pages/setting";
import Info from "./pages/info";
import Register from "./pages/register";
import PurchaseHistory from "./pages/purchaseHistory";
import Receipt from "./pages/receipt";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SaleHistory from "./pages/saleHistory";
import PutRegister from "./pages/putRegister";

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