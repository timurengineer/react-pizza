import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartTotalCount, useCartTotalPrice } from "../store/cartStore";
import AdminLoginModal from "./AdminLoginModal";
import "./Header.css";

interface HeaderProps {
  tagline?: string;
}

function Header({ tagline = "самая вкусная пицца во вселенной" }: HeaderProps) {
  const navigate = useNavigate();
  const totalCount = useCartTotalCount();
  const totalPrice = useCartTotalPrice();
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  return (
    <header className="header">
      <div className="header__brand" onClick={() => navigate("/")}>
        <span className="header__logo">🍕</span>
        <div>
          <h1 className="header__name">REACT PIZZA</h1>
          <p className="header__tagline">{tagline}</p>
        </div>
      </div>

      <div className="header__actions">
        <button type="button" className="header__admin" onClick={() => navigate("/my-orders")}>
          📦 Мои заказы
        </button>
        <button
          type="button"
          className="header__admin"
          onClick={() => setIsAdminModalOpen(true)}
        >
          👤 Admin
        </button>
        <button type="button" className="header__cart" onClick={() => navigate("/cart")}>
          <span>{totalPrice} ₽</span>
          <span className="header__cart-divider" />
          🛒 <span>{totalCount}</span>
        </button>
      </div>

      <AdminLoginModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </header>
  );
}

export default Header
