import { useState } from "react";
import { DOUGH_BY_INDEX, DoughType, Pizza, priceForSize } from "../types";
import { useCartStore } from "../store/cartStore";
import "./PizzaCard.css";

interface PizzaCardProps {
  pizza: Pizza;
}

export default function PizzaCard({ pizza }: PizzaCardProps) {
  const availableDoughs = pizza.types.map((t) => DOUGH_BY_INDEX[t]);
  const [dough, setDough] = useState<DoughType>(availableDoughs[0]);
  const [sizeIndex, setSizeIndex] = useState(0);
  const addToCart = useCartStore((state) => state.addToCart);
  const quantityOf = useCartStore((state) => state.quantityOf);
  const items = useCartStore((state) => state.items);

  const selectedSizeCm = pizza.sizes[sizeIndex];
  const selectedPrice = priceForSize(pizza.price, selectedSizeCm);
  // hajmi (o'lcham) o'zgarganda narx ham yangilanadi
  const quantityInCart = quantityOf(pizza.id);
  void items; // quantityOf har render sayin qayta hisoblanishi uchun items ga obuna bo'lamiz

  return (
    <div className="pizza-card">
      <img className="pizza-card__image" src={pizza.imageUrl} alt={pizza.title} />
      <h3 className="pizza-card__title">{pizza.title}</h3>

      <div className="pizza-card__dough">
        {availableDoughs.map((type) => (
          <button
            key={type}
            type="button"
            className={`pizza-card__pill ${dough === type ? "is-active" : ""}`}
            onClick={() => setDough(type)}
          >
            {type === "thin" ? "тонкое" : "традиционное"}
          </button>
        ))}
      </div>

      <div className="pizza-card__sizes">
        {pizza.sizes.map((cm, index) => (
          <button
            key={cm}
            type="button"
            className={`pizza-card__pill ${sizeIndex === index ? "is-active" : ""}`}
            onClick={() => setSizeIndex(index)}
          >
            {cm} см
          </button>
        ))}
      </div>

      <div className="pizza-card__footer">
        <span className="pizza-card__price">{selectedPrice} ₽</span>
        <button
          type="button"
          className="pizza-card__add"
          onClick={() => addToCart(pizza, dough, selectedSizeCm, selectedPrice)}
        >
          <span className="pizza-card__add-icon">+</span>
          Добавить
          {quantityInCart > 0 && <span className="pizza-card__badge">{quantityInCart}</span>}
        </button>
      </div>
    </div>
  );
}
