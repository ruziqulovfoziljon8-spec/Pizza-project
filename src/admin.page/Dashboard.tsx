import { useState } from "react";
import { useNavigate } from "react-router-dom";
import imgg from "../assets/images/imgg.png";

import Orders from "./Orders";
import Delivered from "./Delivered";
import Statistics from "./Statistics";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Bosh sahifa");

  const renderContent = () => {
    switch (activeTab) {
      case "Bosh sahifa":
        return <Statistics />;
      case "Buyurtmalar":
        return <Orders />;
      case "Yetkazilganlar":
        return <Delivered />;
      case "Bosh sahifa":
        return (
          <div style={styles.card}>
            <h3>Statistika tez kunda...</h3>
          </div>
        );
      default:
        return <Orders />;
    }
  };

  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logoBox}>
          <img src={imgg} alt="Logo" style={{ width: "40px" }} />
          <h2 style={{ fontSize: "18px", margin: 0 }}>PIZZA ADMIN</h2>
        </div>

        <nav style={styles.nav}>
          <button
            onClick={() => setActiveTab("Bosh sahifa")}
            style={{
              ...styles.navBtn,
              backgroundColor:
                activeTab === "Bosh sahifa" ? "#FE5F1E" : "transparent",
              color: activeTab === "Bosh sahifa" ? "white" : "#333",
            }}
          >
            🏠 Bosh sahifa
          </button>
          <button
            onClick={() => setActiveTab("Buyurtmalar")}
            style={{
              ...styles.navBtn,
              backgroundColor:
                activeTab === "Buyurtmalar" ? "#FE5F1E" : "transparent",
              color: activeTab === "Buyurtmalar" ? "white" : "#333",
            }}
          >
            🛒 Buyurtmalar
          </button>
          <button
            onClick={() => setActiveTab("Yetkazilganlar")}
            style={{
              ...styles.navBtn,
              backgroundColor:
                activeTab === "Yetkazilganlar" ? "#FE5F1E" : "transparent",
              color: activeTab === "Yetkazilganlar" ? "white" : "#333",
            }}
          >
            ✅ Yetkazilganlar
          </button>
        </nav>

        <button onClick={() => navigate("/")} style={styles.logoutBtn}>
          🚪 Chiqish
        </button>
      </aside>

      <main style={styles.mainContent}>
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
  sidebar: {
    width: "260px",
    backgroundColor: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #ddd",
    position: "fixed",
    height: "100vh",
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "40px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
  },
  navBtn: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
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
  mainContent: {
    flex: 1,
    marginLeft: "260px", 
    padding: "40px",
  },
  header: {
    marginBottom: "30px",
  },
  pageBody: {
    width: "100%",
  },
  card: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
};
