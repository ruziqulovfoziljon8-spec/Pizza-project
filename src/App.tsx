import imgg from "../src/assets/images/imgg.png";
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Cart from "./card/Cart";
import Filtered from "./filtered/Filtered";
import Home from "./Home/Home";
import Login from "./admin.page/Login";
import Dashboard from "./admin.page/Dashboard";

interface CartItem {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  type: string;
  size: number;
  count: number;
}

function App() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const handleRemoveFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleUpdateCount = (id: string, count: number) => {
    if (count < 1) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, count } : item))
    );
  };

  const handleBackFromCart = () => {
    setShowCart(false);
  };

  const handleAddToCart = (item: {
    title: string;
    imageUrl: string;
    price: number;
    type: string;
    size: number;
  }) => {
    const existingItem = cartItems.find(
      (cartItem) =>
        cartItem.title === item.title &&
        cartItem.type === item.type &&
        cartItem.size === item.size
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem.id === existingItem.id
            ? { ...cartItem, count: cartItem.count + 1 }
            : cartItem
        )
      );
    } else {
      const newItem: CartItem = {
        id: Math.random().toString(36).substring(2, 9),
        ...item,
        count: 1,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.count, 0);

  return (
    <div style={{ backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App">
              <header
                style={{
                  padding: "20px 60px",
                  borderBottom: "1px solid #f0f0f0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 2px 15px rgba(0, 0, 0, 0.05)",
                  position: "sticky",
                  top: 0,
                  zIndex: 1000,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setShowCart(false);
                    navigate("/");
                  }}
                >
                  <img
                    style={{ width: "45px", height: "45px" }}
                    src={imgg}
                    alt="Logo"
                  />
                  <div>
                    <h1
                      style={{
                        margin: 0,
                        fontSize: "22px",
                        fontWeight: "900",
                        color: "#181818",
                        textTransform: "uppercase",
                      }}
                    >
                      React Pizza
                    </h1>
                    <p
                      style={{ margin: 0, color: "#7b7b7b", fontSize: "14px" }}
                    >
                      eng mazali pitsalar faqat bizda
                    </p>
                  </div>
                </div>

                <div
                  style={{ display: "flex", gap: "15px", alignItems: "center" }}
                >
                  <button
                    onClick={() => navigate("/login")}
                    className="secondary-btn"
                    style={{
                      padding: "12px 20px",
                      backgroundColor: "transparent",
                      border: "1px solid #FE5F1E",
                      borderRadius: "30px",
                      color: "#FE5F1E",
                      fontSize: "15px",
                      fontWeight: "700",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    Admin panel
                  </button>

                  <button
                    onClick={() => setShowCart(!showCart)}
                    className="cart-btn"
                    style={{
                      minWidth: "140px",
                      height: "50px",
                      backgroundColor: "#FE5F1E",
                      border: "none",
                      borderRadius: "30px",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "16px",
                      padding: "0 20px",
                      boxShadow: "0 4px 10px rgba(254, 95, 30, 0.2)",
                    }}
                  >
                    <span>{cartTotal} ₽</span>
                    <div
                      style={{
                        width: "1px",
                        height: "20px",
                        backgroundColor: "rgba(255,255,255,0.3)",
                      }}
                    ></div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span>🛒</span>
                      <span>{cartCount}</span>
                    </div>
                  </button>
                </div>
              </header>

              <main style={{ paddingBottom: "50px" }}>
                {showCart ? (
                  <Cart
                    items={cartItems}
                    onRemove={handleRemoveFromCart}
                    onClear={handleClearCart}
                    onUpdateCount={handleUpdateCount}
                    onBack={handleBackFromCart}
                  />
                ) : (
                  <>
                    <Filtered onCategoryChange={setSelectedCategory} />
                    <Home
                      addToCart={handleAddToCart}
                      selectedCategory={selectedCategory}
                    />
                  </>
                )}
              </main>
            </div>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      <style>{`
        .cart-btn:hover { background-color: #e04f1a !important; transform: scale(1.02); }
        .cart-btn:active { transform: scale(0.98); }
        .secondary-btn:hover { background-color: #FE5F1E !important; color: white !important; }
        
        html { scroll-behavior: smooth; }
        
        body { margin: 0; font-family: 'Proxima Nova', system-ui, sans-serif; }
      `}</style>
    </div>
  );
}

export default App;
