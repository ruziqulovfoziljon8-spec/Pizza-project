import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import imgg from "../assets/images/imgg.png";
import Orders from "./Orders";
import Delivered from "./Delivered";
import Statistics from "./Statistics";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Bosh sahifa");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "Bosh sahifa":
        return <Statistics />;
      case "Buyurtmalar":
        return <Orders />;
      case "Yetkazilganlar":
        return <Delivered />;
      default:
        return <Orders />;
    }
  };

  return (
    <div style={styles.container}>
      {isMobile && (
        <button
          style={styles.burgerBtn}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
      )}

      <aside
        style={{
          ...styles.sidebar,
          transform:
            isMobile && !isSidebarOpen ? "translateX(-100%)" : "translateX(0)",
        }}
      >
        <div style={styles.logoBox}>
          <img src={imgg} alt="Logo" style={{ width: "40px" }} />
          <h2 style={{ fontSize: "18px", margin: 0 }}>PIZZA ADMIN</h2>
        </div>

        <nav style={styles.nav}>
          {["Bosh sahifa", "Buyurtmalar", "Yetkazilganlar"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                if (isMobile) setIsSidebarOpen(false);
              }}
              style={{
                ...styles.navBtn,
                backgroundColor: activeTab === tab ? "#FE5F1E" : "transparent",
                color: activeTab === tab ? "white" : "#333",
              }}
            >
              {tab === "Bosh sahifa"
                ? "🏠 "
                : tab === "Buyurtmalar"
                ? "🛒 "
                : "✅ "}{" "}
              {tab}
            </button>
          ))}
        </nav>

        <button onClick={() => navigate("/")} style={styles.logoutBtn}>
          🚪 Chiqish
        </button>
      </aside>

      {/* Overlay */}
      {isMobile && isSidebarOpen && (
        <div style={styles.overlay} onClick={() => setIsSidebarOpen(false)} />
      )}

      <main
        style={{ ...styles.mainContent, marginLeft: isMobile ? "0" : "260px" }}
      >
        <header style={styles.header}>
          <h1 style={{ margin: 0 }}>{activeTab}</h1>
        </header>
        <div style={styles.pageBody}>{renderContent()}</div>
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f4f6f8",
  },
  burgerBtn: {
    position: "fixed",
    top: "20px",
    left: "20px",
    zIndex: 1001,
    fontSize: "24px",
    border: "none",
    background: "none",
    cursor: "pointer",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #ddd",
    position: "fixed",
    height: "100vh",
    zIndex: 1000,
    transition: "0.3s ease",
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "40px",
    marginTop: "20px",
  },
  nav: { display: "flex", flexDirection: "column", gap: "10px", flex: 1 },
  navBtn: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: "bold",
  },
  logoutBtn: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ff4d4f",
    color: "#ff4d4f",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontWeight: "bold",
  },
  mainContent: { flex: 1, padding: "40px", transition: "0.3s ease" },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
  header: { marginBottom: "30px", marginTop: "20px" },
  pageBody: { width: "100%" },
};
