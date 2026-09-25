import { useEffect, useMemo, useState } from "react";
import { CATEGORY_LABELS, CATEGORY_ORDER, PizzaCategory, Pizza, priceForSize } from "../types";
import { getPizzas } from "../api/pizzaApi";
import PizzaCard from "../Components/PizzaCard";
import Header from "../Components/Header";
import "./Menu.css";

type SortOption = "popularity" | "price" | "alphabet";

const SORT_LABELS: Record<SortOption, string> = {
  popularity: "популярности",
  price: "по цене",
  alphabet: "по алфавиту",
};

const CATEGORIES: PizzaCategory[] = ["meat", "vegetarian", "grill", "spicy", "closed"];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<PizzaCategory | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("popularity");
  const [sortOpen, setSortOpen] = useState(false);

  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        const data = await getPizzas();
        setPizzas(data);
      } catch (error) {
        setError("Pizzalarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchPizzas();
  }, []);

  const visiblePizzas = useMemo(() => {
    let list = pizzas.filter(
      (pizza) => activeCategory === "all" || CATEGORY_ORDER[pizza.category] === activeCategory
    );

    list = [...list];
    if (sortBy === "alphabet") {
      list.sort((a, b) => a.title.localeCompare(b.title, "ru"));
    } else if (sortBy === "price") {
      list.sort(
        (a, b) =>
          Math.min(...a.sizes.map((cm) => priceForSize(a.price, cm))) -
          Math.min(...b.sizes.map((cm) => priceForSize(b.price, cm)))
      );
    }
    return list;
  }, [pizzas, activeCategory, sortBy]);

  if (loading) {
    return <h2>Yuklanmoqda...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div className="menu-page">
      <Header />

      <div className="pizza-toolbar">
        <div className="pizza-tabs">
          <button
            type="button"
            className={`pizza-tabs__item ${activeCategory === "all" ? "is-active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            Все
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={`pizza-tabs__item ${activeCategory === category ? "is-active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>

        <div className="pizza-sort">
          <button type="button" className="pizza-sort__trigger" onClick={() => setSortOpen((v) => !v)}>
            Сортировка по: <span>{SORT_LABELS[sortBy]}</span>
          </button>
          {sortOpen && (
            <ul className="pizza-sort__menu">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    className={sortBy === option ? "is-active" : ""}
                    onClick={() => {
                      setSortBy(option);
                      setSortOpen(false);
                    }}
                  >
                    {SORT_LABELS[option]}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <h2 className="pizza-section-title">
        {activeCategory === "all" ? "Все пиццы" : CATEGORY_LABELS[activeCategory]}
      </h2>

      <div className="pizza-grid">
        {visiblePizzas.map((pizza) => (
          <PizzaCard key={pizza.id} pizza={pizza} />
        ))}
      </div>
    </div>
  );
}