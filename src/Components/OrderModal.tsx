import { FormEvent, useState } from "react";
import { CartItem } from "../types";
import { submitOrder, saveMyOrderId } from "../api/orderApi";
import "./OrderModal.css";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  onSuccess: () => void;
}

export default function OrderModal({ isOpen, onClose, items, totalPrice, onSuccess }: OrderModalProps) {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const isValid = fullName.trim().length > 1 && address.trim().length > 3 && phone.trim().length > 5;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    setLoading(true);
    setError("");

    try {
      const order = await submitOrder({ fullName, address, phone, items, totalPrice });
      saveMyOrderId(order.id);
      onSuccess();
    } catch (err) {
      setError("Ошибка при отправке заказа. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-modal__overlay" onClick={onClose}>
      <div className="order-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="order-modal__close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <h2 className="order-modal__title">Оформление заказа</h2>
        <p className="order-modal__subtitle">Сумма заказа: {totalPrice} ₽</p>

        <form className="order-modal__form" onSubmit={handleSubmit}>
          <label className="order-modal__field">
            <span>Ф.И.О.</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Иванов Иван Иванович"
              required
            />
          </label>

          <label className="order-modal__field">
            <span>Адрес доставки</span>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Город, улица, дом, квартира"
              required
            />
          </label>

          <label className="order-modal__field">
            <span>Телефон</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              required
            />
          </label>

          {error && <p className="order-modal__error">{error}</p>}

          <button type="submit" className="order-modal__submit" disabled={!isValid || loading}>
            {loading ? "Отправка..." : "Подтвердить заказ"}
          </button>
        </form>
      </div>
    </div>
  );
}
