import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLoginModal.css";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Hozircha login/parol kodda qattiq yozilgan.
// Keyinchalik bu joyni mockAPI yoki boshqa autentifikatsiya tizimiga almashtirish mumkin.
const ADMIN_LOGIN = "admin";
const ADMIN_PASSWORD = "admin123";

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    setLogin("");
    setPassword("");
    setError("");
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
      localStorage.setItem("isAdmin", "true");
      handleClose();
      navigate("/admin");
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="admin-modal__overlay" onClick={handleClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="admin-modal__close" onClick={handleClose} aria-label="Закрыть">
          ×
        </button>

        <h2 className="admin-modal__title">Вход в админ-панель</h2>

        <form className="admin-modal__form" onSubmit={handleSubmit}>
          <label className="admin-modal__field">
            <span>Логин</span>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="admin"
              autoFocus
              required
            />
          </label>

          <label className="admin-modal__field">
            <span>Пароль</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {error && <p className="admin-modal__error">{error}</p>}

          <button type="submit" className="admin-modal__submit">
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
