
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export default function Delivered() {
  const [completedOrders, setCompletedOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      where("status", "==", "Yetkazildi"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCompletedOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Yuklanmoqda... ✅</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>
        Yetkazilgan buyurtmalar tarixi ({completedOrders.length})
      </h2>
      <div style={{ display: "grid", gap: "20px" }}>
        {completedOrders.map((order) => (
          <div
            key={order.id}
            style={{ ...cardStyle, borderLeft: "5px solid #28a745" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>👤 {order.customer.name}</h4>
              <span
                style={{
                  ...statusStyle,
                  background: "#e6f4ea",
                  color: "#28a745",
                }}
              >
                Bajarildi
              </span>
            </div>
            <p>📅 Sana: {order.createdAt?.toDate().toLocaleString()}</p>
            <p>💰 Summa: {order.totalPrice} ₽</p>
            <details>
              <summary style={{ cursor: "pointer", color: "#777" }}>
                Mahsulotlar ro'yxati
              </summary>
              <div style={{ marginTop: "10px" }}>
                {order.items.map((item: any, i: number) => (
                  <div key={i} style={{ fontSize: "13px" }}>
                    • {item.title} x {item.count}
                  </div>
                ))}
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "15px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};
const statusStyle = {
  padding: "5px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold" as const,
};