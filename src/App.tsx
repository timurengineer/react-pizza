import { Route, Routes } from "react-router-dom";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import MyOrders from "./pages/MyOrders";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/my-orders" element={<MyOrders />} />
    </Routes>
  );
}