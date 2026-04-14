import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

interface PizzaStats {
  id: string;
  title: string;
  price: number;
  rating: number;
  imageUrl: string;
  category: number;
  sizes: number[];
  types: number[];
}

export default function Statistics() {
  const [pizzas, setPizzas] = useState<PizzaStats[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingPizza, setEditingPizza] = useState<PizzaStats | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newPizza, setNewPizza] = useState({
    title: "",
    price: "",
    rating: "5",
    category: "0",
    imageUrl: "",
    sizes: "26, 30, 40",
    types: "0, 1",
  });

  useEffect(() => {
    getPizzaData();
  }, []);

  const getPizzaData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "users"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title || "Nomsiz pitsa",
        price: Number(doc.data().price) || 0,
        rating: Number(doc.data().rating) || 0,
        imageUrl: doc.data().imageUrl || "",
        category: Number(doc.data().category) || 0,
        sizes: Array.isArray(doc.data().sizes) ? doc.data().sizes : [],
        types: Array.isArray(doc.data().types) ? doc.data().types : [],
      })) as PizzaStats[];
      setPizzas(data);
    } catch (error) {
      console.error("Xato:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
      try {
        await deleteDoc(doc(db, "users", id));
        setPizzas(pizzas.filter((p) => p.id !== id));
      } catch (error) {
        console.error("O'chirishda xato:", error);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editingPizza) return;
    try {
      const pizzaRef = doc(db, "users", editingPizza.id);
      await updateDoc(pizzaRef, {
        title: editingPizza.title,
        price: Number(editingPizza.price),
        rating: Number(editingPizza.rating),
        imageUrl: editingPizza.imageUrl,
        category: Number(editingPizza.category),
        sizes: editingPizza.sizes,
        types: editingPizza.types,
      });
      setPizzas(
        pizzas.map((p) => (p.id === editingPizza.id ? editingPizza : p))
      );
      setEditingPizza(null);
    } catch (error) {
      console.error("Yangilashda xato:", error);
    }
  };

  const handleAddPizza = async () => {
    if (!newPizza.title || !newPizza.price) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }
    try {
      const sizesArray = newPizza.sizes.split(",").map((s) => Number(s.trim()));
      const typesArray = newPizza.types.split(",").map((t) => Number(t.trim()));

      const docRef = await addDoc(collection(db, "users"), {
        title: newPizza.title,
        price: Number(newPizza.price),
        rating: Number(newPizza.rating),
        category: Number(newPizza.category),
        imageUrl: newPizza.imageUrl,
        sizes: sizesArray,
        types: typesArray,
      });

      const addedPizza: PizzaStats = {
        id: docRef.id,
        title: newPizza.title,
        price: Number(newPizza.price),
        rating: Number(newPizza.rating),
        category: Number(newPizza.category),
        imageUrl: newPizza.imageUrl,
        sizes: sizesArray,
        types: typesArray,
      };

      setPizzas([addedPizza, ...pizzas]);
      setIsAdding(false);
      setNewPizza({
        title: "",
        price: "",
        rating: "5",
        category: "0",
        imageUrl: newPizza.imageUrl,
        sizes: "26, 30, 40",
        types: "0, 1",
      });
    } catch (error) {
      console.error("Qo'shishda xato:", error);
    }
  };

  if (loading) return <div style={styles.loader}>Yuklanmoqda... 🍕</div>;

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pizza-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .pizza-card:hover { transform: translateY(-12px); box-shadow: 0 20px 30px rgba(0,0,0,0.1) !important; border-color: #FE5F1E !important; }
        .pizza-card:hover img { transform: scale(1.1) rotate(5deg); }
        .stat-card { transition: all 0.3s ease; }
        .stat-card:hover { filter: brightness(0.95); transform: scale(1.02); }
        .admin-btns { display: flex; gap: 10px; width: 100%; margin-top: 15px; }
        .btn { flex: 1; padding: 10px; border-radius: 12px; border: none; cursor: pointer; font-weight: bold; transition: 0.2s; }
        .edit-btn { background: #3498db; color: white; }
        .delete-btn { background: #e74c3c; color: white; }
        .add-main-btn { 
            background: #FE5F1E; color: white; padding: 15px 30px; 
            border-radius: 15px; font-size: 16px; margin-bottom: 30px; 
            box-shadow: 0 10px 20px rgba(254, 95, 30, 0.2);
        }
        .btn:hover { opacity: 0.8; transform: translateY(-2px); }
        .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: white; padding: 30px; border-radius: 20px; width: 400px; text-align: left; max-height: 90vh; overflow-y: auto; }
        .modal-input { width: 100%; padding: 10px; margin: 5px 0 15px 0; border-radius: 8px; border: 1px solid #ddd; outline: none; box-sizing: border-box; }
        label { font-weight: bold; font-size: 14px; color: #555; }
      `}</style>

      <div style={styles.topStatsGrid}>
        <div
          className="stat-card"
          style={{ ...styles.statCard, borderLeft: "6px solid #FE5F1E" }}
        >
          <div style={styles.iconCircle}>📊</div>
          <div>
            <p style={styles.statLabel}>Jami turlar</p>
            <h2 style={styles.statValue}>{pizzas.length} ta</h2>
          </div>
        </div>
        <div
          className="stat-card"
          style={{ ...styles.statCard, borderLeft: "6px solid #2ecc71" }}
        >
          <div style={styles.iconCircle}>💰</div>
          <div>
            <p style={styles.statLabel}>O'rtacha narx</p>
            <h2 style={styles.statValue}>
              {pizzas.length > 0
                ? Math.round(
                    pizzas.reduce((a, b) => a + b.price, 0) / pizzas.length
                  )
                : 0}{" "}
              ₽
            </h2>
          </div>
        </div>
        <div
          className="stat-card"
          style={{ ...styles.statCard, borderLeft: "6px solid #f1c40f" }}
        >
          <div style={styles.iconCircle}>⭐</div>
          <div>
            <p style={styles.statLabel}>Top Reyting</p>
            <h2 style={styles.statValue}>
              {pizzas.length > 0 ? Math.max(...pizzas.map((p) => p.rating)) : 0}
            </h2>
          </div>
        </div>
      </div>

      <button className="btn add-main-btn" onClick={() => setIsAdding(true)}>
        + Yangi pitsa qo'shish
      </button>

      <h3 style={styles.sectionTitle}>Bazada mavjud pitsalar</h3>

      <div style={styles.pizzaGrid}>
        {pizzas.map((pizza) => (
          <div key={pizza.id} style={styles.pizzaCard} className="pizza-card">
            <div style={styles.imageWrapper}>
              <img
                src={pizza.imageUrl}
                alt={pizza.title}
                style={styles.pizzaImg}
              />
            </div>
            <div style={styles.pizzaInfo}>
              <h4 style={styles.pizzaName}>{pizza.title}</h4>
              <div style={styles.divider}></div>
              <div style={styles.pizzaDetails}>
                <span style={styles.pizzaPrice}>{pizza.price} ₽</span>
                <span style={styles.pizzaRating}>⭐ {pizza.rating}</span>
              </div>
              <div className="admin-btns">
                <button
                  className="btn edit-btn"
                  onClick={() => setEditingPizza(pizza)}
                >
                  Edit
                </button>
                <button
                  className="btn delete-btn"
                  onClick={() => handleDelete(pizza.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="modal">
          <div className="modal-content">
            <h3>Yangi pitsa qo'shish</h3>
            <label>Nomi:</label>
            <input
              className="modal-input"
              value={newPizza.title}
              placeholder="Title..."
              onChange={(e) =>
                setNewPizza({ ...newPizza, title: e.target.value })
              }
            />
            <label>ImageUrl:</label>
            <input
              className="modal-input"
              value={newPizza.imageUrl}
              placeholder="Image URL..."
              onChange={(e) =>
                setNewPizza({ ...newPizza, imageUrl: e.target.value })
              }
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <label>Price:</label>
                <input
                  className="modal-input"
                  type="number"
                  value={newPizza.price}
                  placeholder="Price..."
                  onChange={(e) =>
                    setNewPizza({ ...newPizza, price: e.target.value })
                  }
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Rating:</label>
                <input
                  className="modal-input"
                  type="number"
                  value={newPizza.rating}
                  onChange={(e) =>
                    setNewPizza({ ...newPizza, rating: e.target.value })
                  }
                />
              </div>
            </div>
            <label>Category (ID):</label>
            <input
              className="modal-input"
              type="number"
              value={newPizza.category}
              placeholder="Category ID..."
              onChange={(e) =>
                
                setNewPizza({ ...newPizza, category: e.target.value })
              }
            />
            <label>Sizes (O'lchamlar):</label>
            <input
              className="modal-input"
              value={newPizza.sizes}
              onChange={(e) =>
                setNewPizza({ ...newPizza, sizes: e.target.value })
              }
            />
            <label>Types (Turlar):</label>
            <input
              className="modal-input"
              value={newPizza.types}
              onChange={(e) =>
                setNewPizza({ ...newPizza, types: e.target.value })
              }
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                className="btn edit-btn"
                style={{ background: "#FE5F1E" }}
                onClick={handleAddPizza}
              >
                Saqlash
              </button>
              <button
                className="btn"
                style={{ background: "#ccc" }}
                onClick={() => setIsAdding(false)}
              >
                Bekor
              </button>
            </div>
          </div>
        </div>
      )}

      {editingPizza && (
        <div className="modal">
          <div className="modal-content">
            <h3>Tahrirlash</h3>
            <label>Nomi:</label>
            <input
              className="modal-input"
              value={editingPizza.title}
              onChange={(e) =>
                setEditingPizza({ ...editingPizza, title: e.target.value })
              }
            />
            <label>ImageUrl:</label>
            <input
              className="modal-input"
              value={editingPizza.imageUrl}
              onChange={(e) =>
                setEditingPizza({ ...editingPizza, imageUrl: e.target.value })
              }
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <label>Price:</label>
                <input
                  className="modal-input"
                  type="number"
                  value={editingPizza.price}
                  onChange={(e) =>
                    setEditingPizza({
                      ...editingPizza,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Rating:</label>
                <input
                  className="modal-input"
                  type="number"
                  value={editingPizza.rating}
                  onChange={(e) =>
                    setEditingPizza({
                      ...editingPizza,
                      rating: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <label>Category:</label>
            <input
              className="modal-input"
              type="number"
              value={editingPizza.category}
              onChange={(e) =>
                setEditingPizza({
                  ...editingPizza,
                  category: Number(e.target.value),
                })
              }
            />
            <label>Sizes:</label>
            <input
              className="modal-input"
              value={(editingPizza.sizes || []).join(", ")}
              onChange={(e) =>
                setEditingPizza({
                  ...editingPizza,
                  sizes: e.target.value.split(",").map((s) => Number(s.trim())),
                })
              }
            />
            <label>Types:</label>
            <input
              className="modal-input"
              value={(editingPizza.types || []).join(", ")}
              onChange={(e) =>
                setEditingPizza({
                  ...editingPizza,
                  types: e.target.value.split(",").map((t) => Number(t.trim())),
                })
              }
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button className="btn edit-btn" onClick={handleSaveEdit}>
                Saqlash
              </button>
              <button
                className="btn"
                style={{ background: "#ccc" }}
                onClick={() => setEditingPizza(null)}
              >
                Bekor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: "20px", animation: "fadeIn 0.8s ease-out" },
  loader: {
    textAlign: "center",
    marginTop: "100px",
    fontSize: "22px",
    color: "#FE5F1E",
    fontWeight: "bold",
  },
  topStatsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "25px",
    marginBottom: "30px",
  },
  statCard: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "20px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.03)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    cursor: "pointer",
  },
  iconCircle: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#f9f9f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },
  statLabel: { margin: 0, color: "#999", fontSize: "15px", fontWeight: "600" },
  statValue: {
    margin: "5px 0 0 0",
    fontSize: "28px",
    fontWeight: "900",
    color: "#2d2d2d",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "900",
    marginBottom: "30px",
    color: "#1c1c1c",
    letterSpacing: "-0.5px",
  },
  pizzaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "30px",
  },
  pizzaCard: {
    backgroundColor: "white",
    borderRadius: "25px",
    padding: "25px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.04)",
    border: "2px solid transparent",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  imageWrapper: {
    width: "150px",
    height: "150px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pizzaImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transition: "transform 0.4s ease",
  },
  pizzaInfo: { width: "100%" },
  pizzaName: {
    margin: "0 0 15px 0",
    fontSize: "19px",
    fontWeight: "900",
    color: "#1c1c1c",
  },
  divider: {
    height: "1px",
    background: "#f0f0f0",
    width: "100%",
    marginBottom: "15px",
  },
  pizzaDetails: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 5px",
  },
  pizzaPrice: { color: "#FE5F1E", fontWeight: "800", fontSize: "20px" },
  pizzaRating: { fontWeight: "700", color: "#444", fontSize: "16px" },
};
