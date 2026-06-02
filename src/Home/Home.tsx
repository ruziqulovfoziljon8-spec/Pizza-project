import { useEffect, useState, useMemo } from "react";
import type { Pizza } from "../types/pizza,type";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

interface HomeProps {
  addToCart: (item: {
    title: string;
    imageUrl: string;
    price: number;
    type: string;
    size: number;
  }) => void;
  selectedCategory: number | null;
}

type SortType = "rating" | "price" | "title";

export default function Home({ addToCart, selectedCategory }: HomeProps) {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: { type: number; size: number };
  }>({});
  const [sortType] = useState<SortType>("rating");

  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "users"));
        const data = querySnapshot.docs.map((doc) => {
          const rawData = doc.data();
          return {
            id: doc.id,
            title: rawData.title || "",
            imageUrl: rawData.imageUrl || "",
            price: Number(rawData.price) || 0,
            rating: Number(rawData.rating) || 0,
            category: Number(rawData.category) || 0,
            sizes:
              typeof rawData.sizes === "string"
                ? rawData.sizes.split(",").map((s: string) => Number(s.trim()))
                : rawData.sizes || [],
            types:
              typeof rawData.types === "string"
                ? rawData.types.split(",").map((t: string) => Number(t.trim()))
                : rawData.types || [],
          } as Pizza;
        });
        setPizzas(data);
      } catch (err: any) {
        console.error("Firebase xatosi:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  const filteredPizzas = useMemo(() => {
    if (selectedCategory === null) return pizzas;
    return pizzas.filter((pizza) => pizza.category === selectedCategory);
  }, [pizzas, selectedCategory]);

  const sortedPizzas = useMemo(() => {
    const pizzasToSort = [...filteredPizzas];
    switch (sortType) {
      case "rating":
        return pizzasToSort.sort((a, b) => b.rating - a.rating);
      case "price":
        return pizzasToSort.sort((a, b) => a.price - b.price);
      case "title":
        return pizzasToSort.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return pizzasToSort;
    }
  }, [filteredPizzas, sortType]);

  const handleTypeChange = (pizzaId: string, type: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [pizzaId]: { ...prev[pizzaId], type, size: prev[pizzaId]?.size || 30 },
    }));
  };

  const handleSizeChange = (pizzaId: string, size: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [pizzaId]: { ...prev[pizzaId], size, type: prev[pizzaId]?.type ?? 0 },
    }));
  };

  const handleAddToCart = (pizza: Pizza) => {
    const options = selectedOptions[pizza.id] || {
      type: pizza.types[0] || 0,
      size: pizza.sizes[0],
    };
    let price = pizza.price;
    if (options.size === 30) price = Math.round(pizza.price * 1.2);
    if (options.size === 40) price = Math.round(pizza.price * 1.5);
    addToCart({
      title: pizza.title,
      imageUrl: pizza.imageUrl,
      price: price,
      type: options.type === 0 ? "тонкое" : "традиционное",
      size: options.size,
    });
  };

  if (loading)
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Pizzalar yuklanmoqda...</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 className="header-title">
          {selectedCategory === null ? "Все пиццы" : "Пиццы этой категории"}
        </h1>
      </div>
      <div style={styles.grid} className="pizza-grid">
        {sortedPizzas.map((pizza) => {
          const options = selectedOptions[pizza.id] || {
            type: pizza.types[0] || 0,
            size: pizza.sizes[0],
          };
          const currentPrice = Math.round(
            pizza.price *
              (options.size === 30 ? 1.2 : options.size === 40 ? 1.5 : 1)
          );
          return (
            <div key={pizza.id} style={styles.card} className="pizza-card">
              <img
                src={pizza.imageUrl}
                alt={pizza.title}
                style={styles.image}
                className="pizza-img"
              />
              <h3 style={styles.pizzaTitle} className="pizza-title">
                {pizza.title}
              </h3>
              <div style={styles.selector}>
                <div style={styles.selectorRow}>
                  {pizza.types.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTypeChange(pizza.id, t)}
                      style={{
                        ...styles.selectorBtn,
                        background: options.type === t ? "#fff" : "transparent",
                      }}
                    >
                      {t === 0 ? "тонкое" : "традиц."}
                    </button>
                  ))}
                </div>
                <div style={styles.selectorRow}>
                  {pizza.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSizeChange(pizza.id, s)}
                      style={{
                        ...styles.selectorBtn,
                        background: options.size === s ? "#fff" : "transparent",
                      }}
                    >
                      {s} см.
                    </button>
                  ))}
                </div>
              </div>
              <div style={styles.cardBottom}>
                <span style={styles.price}>от {currentPrice} ₽</span>
                <button
                  onClick={() => handleAddToCart(pizza)}
                  style={styles.addBtn}
                  className="add-button"
                >
                  <span>+</span> Добавить
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .pizza-card { transition: all 0.25s ease-in-out; cursor: pointer; }
        .pizza-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .add-button:hover { background: #e04f1a !important; }
        
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        
        @media (max-width: 768px) {
          .pizza-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; padding: 0 10px !important; }
          .pizza-card { padding: 10px !important; }
          .pizza-img { height: 140px !important; }
          .pizza-title { font-size: 14px !important; min-height: 40px !important; }
          .header-title { font-size: 20px !important; text-align: center; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: { padding: "40px 0", backgroundColor: "#fff", minHeight: "100vh" },
  header: { maxWidth: "1200px", margin: "0 auto 40px", padding: "0 20px" },
  grid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "35px",
    padding: "0 20px",
  },
  card: {
    textAlign: "center" as const,
    padding: "20px",
    borderRadius: "20px",
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: "260px",
    objectFit: "contain" as const,
    marginBottom: "15px",
  },
  pizzaTitle: {
    fontSize: "20px",
    fontWeight: "900",
    marginBottom: "20px",
    minHeight: "50px",
  },
  selector: {
    background: "#f3f3f3",
    borderRadius: "10px",
    padding: "6px",
    marginBottom: "20px",
  },
  selectorRow: { display: "flex", gap: "5px", marginBottom: "5px" },
  selectorBtn: {
    flex: 1,
    border: "none",
    padding: "10px 0",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "12px",
    cursor: "pointer",
  },
  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  price: { fontSize: "18px", fontWeight: "700" },
  addBtn: {
    background: "#fe5f1e",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "30px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  loading: { textAlign: "center" as const, marginTop: "150px" },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #fe5f1e",
    borderRadius: "50%",
    margin: "0 auto 20px",
    animation: "spin 1s linear infinite",
  },
};
