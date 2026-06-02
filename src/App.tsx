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

  const handleRemoveFromCart = (id: string) =>
    setCartItems(cartItems.filter((item) => item.id !== id));
  const handleClearCart = () => setCartItems([]);
  const handleUpdateCount = (id: string, count: number) => {
    if (count < 1) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, count } : item))
    );
  };
  const handleBackFromCart = () => setShowCart(false);

  const handleAddToCart = (item: any) => {
    const existingItem = cartItems.find(
      (c) =>
        c.title === item.title && c.type === item.type && c.size === item.size
    );
    if (existingItem) {
      setCartItems(
        cartItems.map((c) =>
          c.id === existingItem.id ? { ...c, count: c.count + 1 } : c
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        { ...item, id: Math.random().toString(36).substring(2, 9), count: 1 },
      ]);
    }
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.count,
    0
  );
  const cartCount = cartItems.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="app-wrapper">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <header className="header">
                <div
                  className="logo-box"
                  onClick={() => {
                    setShowCart(false);
                    navigate("/");
                  }}
                >
                  <img src={imgg} alt="Logo" className="logo-img" />
                  <div className="logo-info">
                    <h1>React Pizza</h1>
                    <p>eng mazali pitsalar</p>
                  </div>
                </div>

                <div className="actions-box">
                  <button
                    onClick={() => navigate("/login")}
                    className="btn-admin"
                  >
                    Admin🔐
                  </button>
                  <button
                    onClick={() => setShowCart(!showCart)}
                    className="btn-cart"
                  >
                    <span>{cartTotal} ₽</span>
                    <div className="divider"></div>
                    <span>🛒 {cartCount}</span>
                  </button>
                </div>
              </header>

              <main className="content">
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
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      <style>{`
        .app-wrapper { background-color: #f9f9f9; min-height: 100vh; }
        .header { 
          padding: 15px; border-bottom: 1px solid #f0f0f0; display: flex; 
          justify-content: space-between; align-items: center; background: rgba(255,255,255,0.95);
          position: sticky; top: 0; z-index: 1000;
        }
        .logo-box { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .logo-img { width: 35px; height: 35px; }
        
        .logo-info h1 { margin: 0; font-size: 18px; text-transform: uppercase; font-weight: 900; }
        .logo-info p { margin: 0; font-size: 11px; color: #7b7b7b; font-weight: 700; }
        
        .actions-box { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
        
        .btn-admin { 
          padding: 6px 12px; border: 1px solid #FE5F1E; border-radius: 20px; 
          background: transparent; color: #FE5F1E; font-weight: 700; cursor: pointer; font-size: 12px;
        }
        .btn-cart { 
          padding: 0 15px; height: 35px; background: #FE5F1E; border: none; border-radius: 20px; 
          color: white; display: flex; align-items: center; gap: 8px; font-weight: 700; cursor: pointer; font-size: 13px;
        }
        .divider { width: 1px; height: 16px; background: rgba(255,255,255,0.3); }

        @media (min-width: 600px) {
          .header { padding: 20px 60px; }
          .logo-img { width: 45px; height: 45px; }
          .logo-info h1 { font-size: 22px; }
          .logo-info p { font-size: 14px; }
          .btn-admin { padding: 10px 20px; font-size: 15px; }
          .btn-cart { height: 50px; min-width: 140px; font-size: 16px; }
        }
        
        body { margin: 0; font-family: 'Proxima Nova', system-ui, sans-serif; }
      `}</style>
    </div>
  );
}

export default App;


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import imgg from "../assets/images/imgg.png";

// import Orders from "./Orders";
// import Delivered from "./Delivered";
// import Statistics from "./Statistics";

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("Bosh sahifa");

//   const renderContent = () => {
//     switch (activeTab) {
//       case "Bosh sahifa":
//         return <Statistics />;
//       case "Buyurtmalar":
//         return <Orders />;
//       case "Yetkazilganlar":
//         return <Delivered />;
//       case "Bosh sahifa":
//         return (
//           <div style={styles.card}>
//             <h3>Statistika tez kunda...</h3>
//           </div>
//         );
//       default:
//         return <Orders />;
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <aside style={styles.sidebar}>
//         <div style={styles.logoBox}>
//           <img src={imgg} alt="Logo" style={{ width: "40px" }} />
//           <h2 style={{ fontSize: "18px", margin: 0 }}>PIZZA ADMIN</h2>
//         </div>

//         <nav style={styles.nav}>
//           <button
//             onClick={() => setActiveTab("Bosh sahifa")}
//             style={{
//               ...styles.navBtn,
//               backgroundColor:
//                 activeTab === "Bosh sahifa" ? "#FE5F1E" : "transparent",
//               color: activeTab === "Bosh sahifa" ? "white" : "#333",
//             }}
//           >
//             🏠 Bosh sahifa
//           </button>
//           <button
//             onClick={() => setActiveTab("Buyurtmalar")}
//             style={{
//               ...styles.navBtn,
//               backgroundColor:
//                 activeTab === "Buyurtmalar" ? "#FE5F1E" : "transparent",
//               color: activeTab === "Buyurtmalar" ? "white" : "#333",
//             }}
//           >
//             🛒 Buyurtmalar
//           </button>
//           <button
//             onClick={() => setActiveTab("Yetkazilganlar")}
//             style={{
//               ...styles.navBtn,
//               backgroundColor:
//                 activeTab === "Yetkazilganlar" ? "#FE5F1E" : "transparent",
//               color: activeTab === "Yetkazilganlar" ? "white" : "#333",
//             }}
//           >
//             ✅ Yetkazilganlar
//           </button>
//         </nav>

//         <button onClick={() => navigate("/")} style={styles.logoutBtn}>
//           🚪 Chiqish
//         </button>
//       </aside>

//       <main style={styles.mainContent}>
//         <header style={styles.header}>
//           <h1 style={{ margin: 0 }}>{activeTab}</h1>
//         </header>
//         <div style={styles.pageBody}>{renderContent()}</div>
//       </main>
//     </div>
//   );
// }

// const styles: { [key: string]: React.CSSProperties } = {
//   container: {
//     display: "flex",
//     minHeight: "100vh",
//     backgroundColor: "#f4f6f8",
//   },
//   sidebar: {
//     width: "260px",
//     backgroundColor: "white",
//     padding: "30px 20px",
//     display: "flex",
//     flexDirection: "column",
//     borderRight: "1px solid #ddd",
//     position: "fixed",
//     height: "100vh",
//   },
//   logoBox: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//     marginBottom: "40px",
//   },
//   nav: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//     flex: 1,
//   },
//   navBtn: {
//     padding: "12px 15px",
//     borderRadius: "10px",
//     border: "none",
//     textAlign: "left",
//     cursor: "pointer",
//     fontWeight: "bold",
//     transition: "0.3s",
//   },
//   logoutBtn: {
//     padding: "12px",
//     borderRadius: "10px",
//     border: "1px solid #ff4d4f",
//     color: "#ff4d4f",
//     backgroundColor: "transparent",
//     cursor: "pointer",
//     fontWeight: "bold",
//   },
//   mainContent: {
//     flex: 1,
//     marginLeft: "260px",
//     padding: "40px",
//   },
//   header: {
//     marginBottom: "30px",
//   },
//   pageBody: {
//     width: "100%",
//   },
//   card: {
//     backgroundColor: "white",
//     padding: "20px",
//     borderRadius: "15px",
//     boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
//   },
// };


