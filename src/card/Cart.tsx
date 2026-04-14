import img22 from "../assets/images/img22.png";
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

const mockCartItems: CartItem[] = [

];

const EmptyCartIcon = () => (
  <svg
    width="300"
    height="255"
    viewBox="0 0 300 255"
    fill="none"
    style={{ marginBottom: "40px" }}
  ></svg>
);

export default function Cart({
  items = mockCartItems,
  onRemove = (id: string) => console.log("Remove item:", id),
  onClear = () => console.log("Clear cart"),
  onUpdateCount = (id: string, count: number) =>
    console.log("Update count:", id, count),
  onBack = () => console.log("Go back"),
}: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(items);

  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleRemove = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    onRemove(id);
  };

  const handleClear = () => {
    setCartItems([]);
    onClear();
  };

  const handleUpdateCount = (id: string, count: number) => {
    if (count < 1) {
      handleRemove(id);
      return;
    }
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, count } : item))
    );
    onUpdateCount(id, count);
  };

  const handleBack = () => onBack();

  const sendOrder = async () => {
    if (!customer.name || !customer.phone || !customer.address) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        customer,
        items: cartItems,
        totalPrice,
        totalCount,
        status: "Kutilmoqda",
        createdAt: serverTimestamp(),
      });
      alert("Buyurtma muvaffaqiyatli yuborildi!");
      setIsModalOpen(false);
      handleClear();
    } catch (e) {
      console.error("Xato: ", e);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "100px 0",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{ marginBottom: "20px", fontSize: "32px", fontWeight: "700" }}
        >
          Корзина пустая 😕
        </h2>
        <p
          style={{
            color: "#777",
            marginBottom: "40px",
            fontSize: "18px",
            lineHeight: "1.5",
          }}
        >
          Вероятней всего, вы не заказывали ещё пиццу. <br /> Для того, чтобы
          заказать пиццу, перейди на главную страницу.
        </p>
        <EmptyCartIcon />
        <button
          onClick={handleBack}
          style={{
            border: "none",
            background: "#282828",
            color: "white",
            borderRadius: "30px",
            padding: "15px 40px",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 60px", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <img style={{ width: "30px", height: "30px" }} src={img22} alt="" />
        <h1
          style={{ fontSize: "32px", fontWeight: "700", marginRight: "850px" }}
        >
          Корзина
        </h1>
        <button
          onClick={handleClear}
          style={{
            border: "none",
            background: "#f5f5f5",
            color: "#fe5f1e",
            padding: "10px 20px",
            borderRadius: "30px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Очистить корзину
        </button>
      </div>

      {cartItems.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 0",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <img
              src={item.imageUrl}
              alt={item.title}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
            <div>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>
                {item.title}
              </h3>
              <p style={{ margin: 0, color: "#777" }}>
                {item.type}, {item.size} см.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => handleUpdateCount(item.id, item.count - 1)}
              style={counterBtnStyle}
            >
              -
            </button>
            <span
              style={{
                minWidth: "30px",
                textAlign: "center",
                fontWeight: "700",
              }}
            >
              {item.count}
            </span>
            <button
              onClick={() => handleUpdateCount(item.id, item.count + 1)}
              style={counterBtnStyle}
            >
              +
            </button>
            <span
              style={{
                minWidth: "100px",
                textAlign: "right",
                fontWeight: "700",
              }}
            >
              {item.price * item.count} ₽
            </span>
            <button
              onClick={() => handleRemove(item.id)}
              style={removeBtnStyle}
            >
              ×
            </button>
          </div>
        </div>
      ))}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "40px",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ margin: 0 }}>
            Всего пицц: <b>{totalCount} шт.</b>
          </p>
          <p style={{ margin: 0 }}>
            Сумма заказа: <b style={{ color: "#fe5f1e" }}>{totalPrice} ₽</b>
          </p>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <button onClick={handleBack} style={secondaryBtnStyle}>
            Вернуться назад
          </button>
          <button onClick={() => setIsModalOpen(true)} style={primaryBtnStyle}>
            Оплатить сейчас
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ marginBottom: "20px" }}>Buyurtma berish</h2>
            <input
              style={inputStyle}
              placeholder="Ismingiz"
              onChange={(e) =>
                setCustomer({ ...customer, name: e.target.value })
              }
            />
            <input
              style={inputStyle}
              placeholder="Telefon raqamingiz"
              onChange={(e) =>
                setCustomer({ ...customer, phone: e.target.value })
              }
            />
            <textarea
              style={{ ...inputStyle, height: "80px" }}
              placeholder="Manzilingiz"
              onChange={(e) =>
                setCustomer({ ...customer, address: e.target.value })
              }
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={sendOrder} style={primaryBtnStyle}>
                Tasdiqlash
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                style={secondaryBtnStyle}
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const counterBtnStyle = {
  width: "32px",
  height: "32px",
  border: "2px solid #fe5f1e",
  borderRadius: "50%",
  background: "white",
  color: "#fe5f1e",
  cursor: "pointer",
  fontWeight: "700" as const,
};
const removeBtnStyle = {
  width: "32px",
  height: "32px",
  border: "2px solid #d7d7d7",
  borderRadius: "50%",
  background: "white",
  color: "#d7d7d7",
  cursor: "pointer",
  fontWeight: "700" as const,
};
const primaryBtnStyle = {
  border: "none",
  background: "#fe5f1e",
  color: "white",
  padding: "10px 20px",
  borderRadius: "30px",
  fontWeight: "700" as const,
  cursor: "pointer",
};
const secondaryBtnStyle = {
  border: "1px solid #ddd",
  background: "white",
  padding: "10px 20px",
  borderRadius: "30px",
  cursor: "pointer",
  fontWeight: "700" as const,
};
const modalOverlayStyle: React.CSSProperties = {
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
const modalContentStyle: React.CSSProperties = {
  background: "white",
  padding: "30px",
  borderRadius: "20px",
  width: "400px",
  display: "flex",
  flexDirection: "column",
};
const inputStyle: React.CSSProperties = {
  marginBottom: "15px",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  outline: "none",
};
