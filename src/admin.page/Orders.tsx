import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

interface Order {
  id: string;
  customer: { name: string; phone: string; address: string };
  items: any[];
  totalPrice: number;
  status: string;
  createdAt: any;
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      const activeOrders = allData.filter(
        (order) =>
          order.status !== "Yetkazildi" && order.status !== "Bekor qilindi"
      );

      setOrders(activeOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleComplete = async (orderId: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: "Yetkazildi" });
      alert("Buyurtma muvaffaqiyatli yakunlandi! ✅");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async (orderId: string) => {
    const confirmCancel = window.confirm(
      "Haqiqatan ham bu buyurtmani bekor qilmoqchimisiz?"
    );
    if (confirmCancel) {
      try {
        await updateDoc(doc(db, "orders", orderId), {
          status: "Bekor qilindi",
        });
        alert("Buyurtma bekor qilindi! ❌");
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Yuklanmoqda... 📦</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>
        Yangi Buyurtmalar ({orders.length})
      </h2>

      <div style={{ display: "grid", gap: "20px" }}>
        {orders.map((order) => (
          <div key={order.id} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>👤 {order.customer.name}</h4>
              <span style={statusStyle}>{order.status || "Yangi"}</span>
            </div>

            <p style={{ fontSize: "14px", margin: "5px 0" }}>
              📞 {order.customer.phone}
            </p>
            <p style={{ fontSize: "14px", margin: "5px 0" }}>
              📍 {order.customer.address}
            </p>

            <hr
              style={{
                border: "none",
                borderTop: "1px solid #eee",
                margin: "15px 0",
              }}
            />

            <div style={{ marginBottom: "15px" }}>
              {order.items.map((item, index) => (
                <div key={index} style={{ fontSize: "14px", color: "#555" }}>
                  • {item.title} ({item.count} ta)
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ color: "#fe5f1e", margin: 0 }}>
                {order.totalPrice} ₽
              </h3>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleCancel(order.id)}
                  style={cancelBtnStyle}
                >
                  Bekor qilish
                </button>

                <button
                  onClick={() => handleComplete(order.id)}
                  style={completeBtnStyle}
                >
                  ✅ Yetkazildi
                </button>
              </div>
            </div>
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
  borderLeft: "5px solid #fe5f1e",
};

const statusStyle = {
  background: "#fff7f2",
  color: "#fe5f1e",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold" as const,
};

const completeBtnStyle = {
  background: "#28a745",
  color: "white",
  border: "none",
  padding: "10px 15px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold" as const,
};

const cancelBtnStyle = {
  background: "white",
  color: "#dc3545",
  border: "1px solid #dc3545",
  padding: "10px 15px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold" as const,
};
