import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPizza, deletePizza, getPizzas, PizzaInput, updatePizza } from "../api/pizzaApi";
import { cancelOrder, getOrders, Order, setOrderDelivered } from "../api/orderApi";
import { CATEGORY_LABELS, CATEGORY_ORDER, Pizza, priceForSize } from "../types";
import PizzaFormModal from "../Components/PizzaFormModal";
import "./Admin.css";

type Tab = "products" | "orders" | "delivered" | "cancelled";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("products");
  const [search, setSearch] = useState("");

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [pizzasLoading, setPizzasLoading] = useState(true);
  const [pizzasError, setPizzasError] = useState("");

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPizza, setEditingPizza] = useState<Pizza | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    if (!isAdmin) {
      navigate("/");
      return;
    }
    loadPizzas();
    loadOrders();
  }, [navigate]);

  const loadPizzas = async () => {
    setPizzasLoading(true);
    setPizzasError("");
    try {
      setPizzas(await getPizzas());
    } catch {
      setPizzasError("Не удалось загрузить список пицц.");
    } finally {
      setPizzasLoading(false);
    }
  };

  const loadOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const data = await getOrders();
      setOrders(data.slice().reverse());
    } catch {
      setOrdersError("Не удалось загрузить список заказов.");
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const openAddForm = () => {
    setEditingPizza(null);
    setIsFormOpen(true);
    setActiveTab("products");
  };

  const openEditForm = (pizza: Pizza) => {
    setEditingPizza(pizza);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPizza(null);
  };

  const handleSave = async (input: PizzaInput) => {
    if (editingPizza) {
      const updated = await updatePizza(editingPizza.id, input);
      setPizzas((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await createPizza(input);
      setPizzas((prev) => [created, ...prev]);
    }
    closeForm();
  };

  const handleDeletePizza = async (pizza: Pizza) => {
    if (!window.confirm(`Удалить пиццу «${pizza.title}»?`)) return;

    setDeletingId(pizza.id);
    try {
      await deletePizza(pizza.id);
      setPizzas((prev) => prev.filter((p) => p.id !== pizza.id));
    } catch {
      window.alert("Не удалось удалить пиццу. Попробуйте ещё раз.");
    } finally {
      setDeletingId(null);
    }
  };

  const toggleDelivered = async (order: Order) => {
    setUpdatingOrderId(order.id);
    try {
      const updated = await setOrderDelivered(order.id, !order.delivered);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch {
      window.alert("Не удалось обновить статус заказа.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCancelOrder = async (order: Order) => {
    if (!window.confirm(`Отменить заказ клиента «${order.fullName}»?`)) return;

    setUpdatingOrderId(order.id);
    try {
      const updated = await cancelOrder(order.id);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    } catch {
      window.alert("Не удалось отменить заказ.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredPizzas = useMemo(
    () => pizzas.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())),
    [pizzas, search]
  );

  const activeOrders = useMemo(
    () => orders.filter((o) => !o.delivered && !o.cancelled),
    [orders]
  );
  const deliveredOrders = useMemo(
    () => orders.filter((o) => o.delivered && !o.cancelled),
    [orders]
  );
  const cancelledOrders = useMemo(() => orders.filter((o) => o.cancelled), [orders]);

  const ordersByTab: Record<Exclude<Tab, "products">, Order[]> = {
    orders: activeOrders,
    delivered: deliveredOrders,
    cancelled: cancelledOrders,
  };

  const visibleOrders = (
    activeTab === "products" ? [] : ordersByTab[activeTab]
  ).filter(
    (o) =>
      o.fullName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">🍕 Logo</div>
        <nav className="admin-sidebar__nav">
          <button
            type="button"
            className={activeTab === "products" ? "is-active" : ""}
            onClick={() => setActiveTab("products")}
          >
            Mahsulotlar
          </button>
          <button
            type="button"
            className={activeTab === "orders" ? "is-active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Buyurtmalar
            {activeOrders.length > 0 && <span className="admin-sidebar__badge">{activeOrders.length}</span>}
          </button>
          <button
            type="button"
            className={activeTab === "delivered" ? "is-active" : ""}
            onClick={() => setActiveTab("delivered")}
          >
            Yetkazilganlar
          </button>
          <button
            type="button"
            className={activeTab === "cancelled" ? "is-active" : ""}
            onClick={() => setActiveTab("cancelled")}
          >
            Bekor qilinganlar
          </button>
        </nav>
        <button type="button" className="admin-sidebar__logout" onClick={handleLogout}>
          Chiqish
        </button>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <input
            type="text"
            className="admin-topbar__search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" className="admin-topbar__add" onClick={openAddForm}>
            Mahsulot qo'shish
          </button>
        </div>

        <div className="admin-content">
          {activeTab === "products" && (
            <>
              {pizzasLoading && <p className="admin-status">Загрузка...</p>}
              {pizzasError && <p className="admin-status admin-status--error">{pizzasError}</p>}
              {!pizzasLoading && !pizzasError && (
                <div className="admin-table__wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Nomi</th>
                        <th>Kategoriya</th>
                        <th>Narxi</th>
                        <th>O'lchamlar</th>
                        <th>Reyting</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPizzas.map((pizza) => (
                        <tr key={pizza.id}>
                          <td>
                            <img className="admin-table__thumb" src={pizza.imageUrl} alt={pizza.title} />
                          </td>
                          <td>{pizza.title}</td>
                          <td>{CATEGORY_LABELS[CATEGORY_ORDER[pizza.category]] ?? "—"}</td>
                          <td>от {Math.min(...pizza.sizes.map((cm) => priceForSize(pizza.price, cm)))} ₽</td>
                          <td>{pizza.sizes.join(", ")} см</td>
                          <td>⭐ {pizza.rating}</td>
                          <td className="admin-table__actions">
                            <button type="button" onClick={() => openEditForm(pizza)}>
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePizza(pizza)}
                              disabled={deletingId === pizza.id}
                            >
                              {deletingId === pizza.id ? "…" : "🗑"}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredPizzas.length === 0 && (
                        <tr>
                          <td colSpan={7} className="admin-table__empty">
                            Hech narsa topilmadi.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeTab !== "products" && (
            <>
              {ordersLoading && <p className="admin-status">Загрузка...</p>}
              {ordersError && <p className="admin-status admin-status--error">{ordersError}</p>}
              {!ordersLoading && !ordersError && (
                <div className="admin-table__wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ism</th>
                        <th>manzil</th>
                        <th>raqam</th>
                        <th>mahsulotlar</th>
                        <th>summa</th>
                        {activeTab === "orders" && <th>d</th>}
                        {activeTab !== "cancelled" && <th></th>}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleOrders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.fullName}</td>
                          <td>{order.address}</td>
                          <td>{order.phone}</td>
                          <td>
                            {order.items.map((item) => `${item.title} (${item.quantity}x)`).join(", ")}
                          </td>
                          <td>{order.totalPrice} ₽</td>
                          {activeTab === "orders" && (
                            <td className="admin-table__checkbox">
                              <input
                                type="checkbox"
                                checked={order.delivered}
                                disabled={updatingOrderId === order.id}
                                onChange={() => toggleDelivered(order)}
                              />
                            </td>
                          )}
                          {activeTab !== "cancelled" && (
                            <td className="admin-table__actions">
                              <button
                                type="button"
                                onClick={() => handleCancelOrder(order)}
                                disabled={updatingOrderId === order.id}
                                title="Bekor qilish"
                              >
                                ✕
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                      {visibleOrders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="admin-table__empty">
                            {activeTab === "orders" && "Buyurtmalar yo'q."}
                            {activeTab === "delivered" && "Yetkazilganlar yo'q."}
                            {activeTab === "cancelled" && "Bekor qilinganlar yo'q."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <PizzaFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={handleSave}
        initialPizza={editingPizza}
      />
    </div>
  );
}
