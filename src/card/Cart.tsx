import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface CartItem {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  type: string;
  size: number;
  count: number;
}

interface CartProps {
  items?: CartItem[];
  onRemove?: (id: string) => void;
  onClear?: () => void;
  onUpdateCount?: (id: string, count: number) => void;
  onBack?: () => void;
}

export default function Cart({
  items = [],
  onRemove = () => {},
  onClear = () => {},
  onUpdateCount = () => {},
  onBack = () => {},
}: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(items);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    setCartItems(items);
  }, [items]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );
  const totalCount = cartItems.reduce((sum, item) => sum + item.count, 0);

  const handleUpdateCount = (id: string, count: number) => {
    if (count < 1) {
      setCartItems(cartItems.filter((i) => i.id !== id));
      onRemove(id);
    } else {
      setCartItems(cartItems.map((i) => (i.id === id ? { ...i, count } : i)));
      onUpdateCount(id, count);
    }
  };

  const sendOrder = async () => {
    if (!customer.name || !customer.phone || !customer.address)
      return alert("Barcha maydonlarni to'ldiring!");

    setIsLoading(true); 
    try {
      await addDoc(collection(db, "orders"), {
        customer,
        items: cartItems,
        totalPrice,
        totalCount,
        status: "Kutilmoqda",
        createdAt: serverTimestamp(),
      });
      alert("Buyurtma yuborildi!");
      setIsModalOpen(false);
      setCartItems([]);
      onClear();
    } catch (e) {
      console.error(e);
      alert("Xatolik yuz berdi!");
    } finally {
      setIsLoading(false); 
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px 20px" }}>
        <h2 style={{ fontSize: "28px" }}>Корзина пустая 😕</h2>
        <button
          onClick={onBack}
          style={{ ...primaryBtnStyle, marginTop: "20px" }}
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  return (
    <div
      className="cart-container"
      style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}
    >
      <div
        className="cart-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ fontSize: "24px", margin: 0 }}>Корзина</h1>
        <button
          onClick={() => {
            setCartItems([]);
            onClear();
          }}
          style={{
            border: "none",
            background: "none",
            color: "#fe5f1e",
            cursor: "pointer",
          }}
        >
          Очистить корзину
        </button>
      </div>

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="cart-item"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            padding: "20px 0",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{ width: "60px", height: "60px", borderRadius: "10px" }}
          />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: "16px" }}>{item.title}</h3>
            <p style={{ margin: 0, color: "#777", fontSize: "13px" }}>
              {item.type}, {item.size} см.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => handleUpdateCount(item.id, item.count - 1)}
              style={counterBtnStyle}
            >
              -
            </button>
            <span>{item.count}</span>
            <button
              onClick={() => handleUpdateCount(item.id, item.count + 1)}
              style={counterBtnStyle}
            >
              +
            </button>
          </div>
          <b style={{ minWidth: "60px", textAlign: "right" }}>
            {item.price * item.count} ₽
          </b>
        </div>
      ))}

      <div
        className="cart-footer"
        style={{ marginTop: "30px", textAlign: "center" }}
      >
        <p>
          Итого: <b>{totalPrice} ₽</b>
        </p>
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <button onClick={onBack} style={secondaryBtnStyle}>
            Назад
          </button>
          <button onClick={() => setIsModalOpen(true)} style={primaryBtnStyle}>
            Оплатить сейчас
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Buyurtmani rasmiylashtirish</h2>
            <input
              placeholder="Ismingiz"
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
              style={inputStyle}
            />
            <input
              placeholder="Telefon raqami"
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
              style={inputStyle}
            />
            <input
              placeholder="Manzil"
              onChange={(e) =>
                setCustomer({ ...customer, address: e.target.value })
              }
              style={inputStyle}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={sendOrder}
                style={primaryBtnStyle}
                disabled={isLoading}
              >
                {isLoading ? "Yuborilmoqda..." : "Tasdiqlash"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                style={secondaryBtnStyle}
                disabled={isLoading}
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 600px) {
          .cart-footer { display: flex; justify-content: space-between; align-items: center; }
          .cart-footer div { flex-direction: row !important; }
        }
      `}</style>
    </div>
  );
}

const counterBtnStyle = {
  width: "30px",
  height: "30px",
  border: "1px solid #fe5f1e",
  borderRadius: "50%",
  background: "white",
  color: "#fe5f1e",
  cursor: "pointer",
};
const primaryBtnStyle = {
  border: "none",
  background: "#fe5f1e",
  color: "white",
  padding: "12px 25px",
  borderRadius: "30px",
  cursor: "pointer",
};
const secondaryBtnStyle = {
  border: "1px solid #ddd",
  background: "white",
  padding: "12px 25px",
  borderRadius: "30px",
  cursor: "pointer",
};
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};
const modalContentStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "20px",
  width: "300px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};
const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ddd",
};
