import { useState } from "react";
import { useNavigate } from "react-router-dom";
import imgg from "../assets/images/imgg.png"; 

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      navigate("/dashboard");
    } else {
      setError("Login yoki parol noto‘g‘ri!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url('https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Proxima Nova', sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "380px",
          padding: "50px 40px",
          background: "rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "35px",
          boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          flexDirection: "column",
          gap: "25px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <img
            src={imgg}
            alt="Pizza Logo"
            style={{
              width: "90px",
              height: "90px",
              marginBottom: "15px",
              filter: "drop-shadow(0 8px 12px rgba(0,0,0,0.3))",
            }}
          />
          <h2
            style={{
              color: "white",
              margin: 0,
              fontSize: "26px",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
            }}
          >
            Admin Kirish
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "14px",
              marginTop: "8px",
            }}
          >
            Ma'lumotlarni boshqarish tizimi
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Foydalanuvchi nomi</label>
            <input
              type="text"
              placeholder="Loginni kiriting"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              className="login-input"
              required
            />
          </div>

          <div style={styles.inputContainer}>
            <label style={styles.label}>Parol</label>
            <input
              type="password"
              placeholder="Parolni kiriting"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              className="login-input"
              required
            />
          </div>
        </div>

        {error && (
          <p
            style={{
              color: "#ff6b6b",
              fontSize: "14px",
              textAlign: "center",
              fontWeight: "600",
              background: "rgba(255, 107, 107, 0.1)",
              padding: "8px",
              borderRadius: "10px",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            padding: "16px",
            borderRadius: "18px",
            border: "none",
            background: "#FE5F1E",
            color: "white",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 10px 20px rgba(254, 95, 30, 0.3)",
            marginTop: "10px",
          }}
          className="login-btn"
        >
          Tizimga kirish
        </button>
      </form>

      <style>{`
        .login-input:focus {
          border-color: #FE5F1E !important;
          background: rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 0 15px rgba(254, 95, 30, 0.25);
        }
        .login-btn:hover {
          background: #e04f1a !important;
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(254, 95, 30, 0.4) !important;
        }
        .login-btn:active {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}

const styles = {
  inputContainer: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
  },
  label: {
    color: "rgba(255,255,255,0.9)",
    fontSize: "14px",
    fontWeight: "600",
    marginLeft: "8px",
  },
  input: {
    padding: "15px 20px",
    borderRadius: "15px",
    border: "1px solid rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "white",
    fontSize: "16px",
    outline: "none",
    transition: "all 0.3s ease",
  },
};
