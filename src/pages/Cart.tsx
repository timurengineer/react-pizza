import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore, useCartTotalCount, useCartTotalPrice } from "../store/cartStore";
import { DOUGH_LABELS } from "../types";
import Header from "../Components/Header";
import OrderModal from "../Components/OrderModal";
import "./Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const increment = useCartStore((state) => state.increment);
  const decrement = useCartStore((state) => state.decrement);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalCount = useCartTotalCount();
  const totalPrice = useCartTotalPrice();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleOrderSuccess = () => {
    setIsModalOpen(false);
    clearCart();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="cart-page">
        <Header tagline="самая реактивная пицца" />
        <div className="cart-card">
          <div className="cart-empty">
            <p>✅ Заказ успешно оформлен!</p>
            <button type="button" className="cart-back" onClick={() => navigate("/")}>
              Вернуться в меню
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header tagline="самая реактивная пицца" />

      <div className="cart-card">
        <div className="cart-card__top">
          <h2 className="cart-title">
            🛒 Корзина
          </h2>
          {items.length > 0 && (
            <button type="button" className="cart-clear" onClick={clearCart}>
              🗑 Очистить корзину
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Корзина пуста</p>
            <button type="button" className="cart-back" onClick={() => navigate("/")}>
              Перейти к выбору пиццы
            </button>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.cartId} className="cart-row">
                  <img className="cart-row__image" src={item.image} alt={item.title} />
                  <div className="cart-row__info">
                    <p className="cart-row__title">{item.title}</p>
                    <p className="cart-row__meta">
                      {DOUGH_LABELS[item.dough]}, {item.sizeCm} см.
                    </p>
                  </div>
                  <div className="cart-row__qty">
                    <button type="button" onClick={() => decrement(item.cartId)} aria-label="Уменьшить">
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => increment(item.cartId)} aria-label="Увеличить">
                      +
                    </button>
                  </div>
                  <div className="cart-row__price">{item.unitPrice * item.quantity} ₽</div>
                  <button
                    type="button"
                    className="cart-row__remove"
                    onClick={() => removeItem(item.cartId)}
                    aria-label="Удалить"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-summary">
              <p className="cart-summary__count">
                Всего пицц: <strong>{totalCount} шт.</strong>
              </p>
              <p className="cart-summary__total">
                Сумма заказа: <strong>{totalPrice} ₽</strong>
              </p>
            </div>

            <div className="cart-actions">
              <button type="button" className="cart-back" onClick={() => navigate("/")}>
                ‹ Вернуться назад
              </button>
              <button type="button" className="cart-pay" onClick={() => setIsModalOpen(true)}>
                Оплатить сейчас
              </button>
            </div>
          </>
        )}
      </div>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={items}
        totalPrice={totalPrice}
        onSuccess={handleOrderSuccess}
      />
    </div>
  );
}
