


import Image from "next/image";

const menuItems = [
  { id: 1, name: "Classic Pearl Milk Tea 2", price: 5.80 },
  { id: 2, name: "Honey Pearl Milk Tea", price: 6.00 },
  { id: 3, name: "Coffee Creama", price: 6.00 },
  { id: 4, name: "Coffee Milk Tea w/ Coffee Jelly", price: 6.25 },
  { id: 5, name: "Hokkaido Pearl Milk Team", price: 6.25 },
  { id: 6, name: "Thai Pearl Milk Team", price: 6.25 },
  { id: 7, name: "Mango Green Tea", price: 5.80 },
  { id: 9, name: "Honey Lemonade", price: 5.20 },
  { id: 10, name: "Mango & Passion Fruit Tea", price: 6.25 },
  { id: 11, name: "Tiger Passion Cheese", price: 6.25 },
  { id: 12, name: "Mango Boba", price: 6.50 },
  { id: 13, name: "Strawberry Coconut", price: 6.50 },
  { id: 14, name: "Halo Halo", price: 6.95 },
  { id: 15, name: "Matcha Pearl Milk Tea", price: 6.50 },
  { id: 16, name: "Strawberry Matcha Fresh Milk", price: 6.45 },
  { id: 17, name: "Matcha Fresh Milk", price: 6.25 },
  { id: 18, name: "Mango Matcha Fresh Milk", price: 6.50 },
  { id: 19, name: "Oreo w/ Pearl", price: 6.75 },
  { id: 20, name: "Taro w/ Pudding", price: 6.75 },
  { id: 21, name: "Thai Tea w/ Pearl", price: 6.75 },
  { id: 22, name: "Coffee w/ Ice Cream", price: 6.75 },
];

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#22223b", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ background: "#fff", borderRadius: 24, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", padding: 48, minWidth: 900, maxWidth: 1300, width: "95%" }}>
        <h1 style={{ fontSize: 54, fontWeight: 900, marginBottom: 48, textAlign: "center", letterSpacing: 2, color: "#22223b", textShadow: "0 2px 8px #e0e1dd" }}>Drinks Menu</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 36 }}>
          {menuItems.map((item) => (
            <div key={item.id} style={{ background: "#f8fafc", borderRadius: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 340 }}>
              <div style={{ width: 180, height: 180, background: "#e0e1dd", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28, overflow: "hidden", fontSize: 64, color: '#bcbcbc', fontWeight: 700, letterSpacing: 2 }}>
                {/* Large image placeholder */}
                <span role="img" aria-label="drink">🥤</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#22223b", marginBottom: 10, textAlign: "center", minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.name}</div>
              <div style={{ fontSize: 24, fontWeight: 600, color: "#4a7c59", textAlign: "center", marginTop: 8 }}>${item.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
