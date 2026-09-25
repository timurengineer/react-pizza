import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cancelOrder, getMyOrderIds, getOrderById, Order } from "../api/orderApi";
import { DOUGH_LABELS } from "../types";
import Header from "../Components/Header";
import "./MyOrders.css";

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const ids = getMyOrderIds();

    const results = await Promise.allSettled(ids.map((id) => getOrderById(id)));
    const found = results
      .filter((r): r is PromiseFulfilledResult<Order> => r.status === "fulfilled")
      .map((r) => r.value);

    setOrders(found);
    setLoading(false);
  };

  const handleCancel = async (order: Order) => {
    if (!window.confirm("Отменить этот заказ?")) return;

    setCancellingId(order.id);
    try {
      const updated = await cancelOrder(order.id);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch {
      window.alert("Не удалось отменить заказ. Попробуйте ещё раз.");
    } finally {
      setCancellingId(null);
    }
  };

  const statusLabel = (order: Order) => {
    if (order.cancelled) return { text: "Отменён", className: "is-cancelled" };
    if (order.delivered) return { text: "Доставлен", className: "is-delivered" };
    return { text: "В обработке", className: "is-pending" };
  };

  return (
    <div className="my-orders-page">
      <Header tagline="самая реактивная пицца" />

      <div className="my-orders">
        <div className="my-orders__top">
          <h2>Мои заказы</h2>
          <button type="button" className="my-orders__back" onClick={() => navigate("/")}>
            ‹ В меню
          </button>
        </div>

        {loading && <p className="my-orders__status">Загрузка...</p>}

        {!loading && orders.length === 0 && (
          <div className="my-orders__empty">
            <p>У вас пока нет заказов.</p>
            <button type="button" className="my-orders__back" onClick={() => navigate("/")}>
              Перейти к выбору пиццы
            </button>
          </div>
        )}

        {!loading &&
          orders.map((order) => {
            const status = statusLabel(order);
            const canCancel = !order.delivered && !order.cancelled;

            return (
              <div className="my-orders__card" key={order.id}>
                <div className="my-orders__card-top">
                  <span className={`my-orders__status-pill ${status.className}`}>{status.text}</span>
                  <span className="my-orders__date">
                    {new Date(order.createdAt).toLocaleString("ru-RU")}
                  </span>
                </div>

                <ul className="my-orders__items">
                  {order.items.map((item) => (
                    <li key={item.cartId}>
                      {item.title} — {DOUGH_LABELS[item.dough]}, {item.sizeCm} см × {item.quantity}
                    </li>
                  ))}
                </ul>

                <div className="my-orders__card-bottom">
                  <span className="my-orders__total">Сумма: {order.totalPrice} ₽</span>
                  {canCancel && (
                    <button
                      type="button"
                      className="my-orders__cancel"
                      onClick={() => handleCancel(order)}
                      disabled={cancellingId === order.id}
                    >
                      {cancellingId === order.id ? "Отмена..." : "Отменить заказ"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
