import { FormEvent, useState } from "react";
import { CATEGORY_LABELS, CATEGORY_ORDER, DOUGH_LABELS, DoughType, Pizza } from "../types";
import { PizzaInput } from "../api/pizzaApi";
import "./PizzaFormModal.css";

interface PizzaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pizza: PizzaInput) => Promise<void>;
  initialPizza?: Pizza | null;
}

const ALL_SIZES = [26, 30, 40];
const ALL_DOUGHS: DoughType[] = ["thin", "traditional"];

export default function PizzaFormModal({ isOpen, onClose, onSave, initialPizza }: PizzaFormModalProps) {
  const isEditing = Boolean(initialPizza);

  const [title, setTitle] = useState(initialPizza?.title ?? "");
  const [imageUrl, setImageUrl] = useState(initialPizza?.imageUrl ?? "");
  const [price, setPrice] = useState(initialPizza?.price?.toString() ?? "");
  const [rating, setRating] = useState(initialPizza?.rating?.toString() ?? "5");
  const [categoryIndex, setCategoryIndex] = useState(initialPizza?.category ?? 0);
  const [selectedDoughs, setSelectedDoughs] = useState<number[]>(initialPizza?.types ?? [0, 1]);
  const [selectedSizes, setSelectedSizes] = useState<number[]>(initialPizza?.sizes ?? [26, 30, 40]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const toggleDough = (index: number) => {
    setSelectedDoughs((prev) =>
      prev.includes(index) ? prev.filter((d) => d !== index) : [...prev, index].sort()
    );
  };

  const toggleSize = (cm: number) => {
    setSelectedSizes((prev) =>
      prev.includes(cm) ? prev.filter((s) => s !== cm) : [...prev, cm].sort((a, b) => a - b)
    );
  };

  const isValid =
    title.trim().length > 1 &&
    imageUrl.trim().length > 5 &&
    Number(price) > 0 &&
    selectedDoughs.length > 0 &&
    selectedSizes.length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || saving) return;

    setSaving(true);
    setError("");

    try {
      await onSave({
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        price: Number(price),
        rating: Number(rating) || 0,
        category: categoryIndex,
        types: selectedDoughs,
        sizes: selectedSizes,
      });
    } catch (err) {
      setError("Не удалось сохранить пиццу. Попробуйте ещё раз.");
      setSaving(false);
    }
  };

  return (
    <div className="pizza-form-modal__overlay" onClick={onClose}>
      <div className="pizza-form-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="pizza-form-modal__close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <h2 className="pizza-form-modal__title">
          {isEditing ? "Редактировать пиццу" : "Добавить пиццу"}
        </h2>

        <form className="pizza-form-modal__form" onSubmit={handleSubmit}>
          <label className="pizza-form-modal__field">
            <span>Название</span>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>

          <label className="pizza-form-modal__field">
            <span>Ссылка на изображение</span>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              required
            />
          </label>

          {imageUrl && (
            <img className="pizza-form-modal__preview" src={imageUrl} alt="preview" />
          )}

          <div className="pizza-form-modal__row">
            <label className="pizza-form-modal__field">
              <span>Базовая цена (₽)</span>
              <input
                type="number"
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </label>

            <label className="pizza-form-modal__field">
              <span>Рейтинг</span>
              <input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              />
            </label>
          </div>

          <label className="pizza-form-modal__field">
            <span>Категория</span>
            <select
              value={categoryIndex}
              onChange={(e) => setCategoryIndex(Number(e.target.value))}
            >
              {CATEGORY_ORDER.map((cat, index) => (
                <option key={cat} value={index}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </label>

          <div className="pizza-form-modal__field">
            <span>Тесто</span>
            <div className="pizza-form-modal__pills">
              {ALL_DOUGHS.map((dough, index) => (
                <button
                  type="button"
                  key={dough}
                  className={`pizza-form-modal__pill ${selectedDoughs.includes(index) ? "is-active" : ""}`}
                  onClick={() => toggleDough(index)}
                >
                  {DOUGH_LABELS[dough]}
                </button>
              ))}
            </div>
          </div>

          <div className="pizza-form-modal__field">
            <span>Размеры</span>
            <div className="pizza-form-modal__pills">
              {ALL_SIZES.map((cm) => (
                <button
                  type="button"
                  key={cm}
                  className={`pizza-form-modal__pill ${selectedSizes.includes(cm) ? "is-active" : ""}`}
                  onClick={() => toggleSize(cm)}
                >
                  {cm} см
                </button>
              ))}
            </div>
          </div>

          {error && <p className="pizza-form-modal__error">{error}</p>}

          <button type="submit" className="pizza-form-modal__submit" disabled={!isValid || saving}>
            {saving ? "Сохранение..." : isEditing ? "Сохранить изменения" : "Добавить пиццу"}
          </button>
        </form>
      </div>
    </div>
  );
}
