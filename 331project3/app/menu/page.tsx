"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const LAT = 30.6280;
const LON = -96.3344;

function useWeather() {
  const [weather, setWeather] = useState<{ tempF: number | null; type: string | null }>({ tempF: null, type: null });
  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`);
        const data = await res.json();
        const tempC = data.current_weather?.temperature ?? null;
        const tempF = tempC !== null ? Math.round((tempC * 9) / 5 + 32) : null;
        const code = data.current_weather?.weathercode;
        const type = code !== undefined ? weatherCodeToType(code) : null;
        setWeather({ tempF, type });
      } catch {
        setWeather({ tempF: null, type: null });
      }
    }
    fetchWeather();
  }, []);
  return weather;
}

function weatherCodeToType(code: number): string {
  if (code === 0) return "Clear";
  if (code === 1 || code === 2 || code === 3) return "Partly Cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if (code === 51 || code === 53 || code === 55) return "Drizzle";
  if (code === 61 || code === 63 || code === 65) return "Rainy";
  if (code === 80 || code === 81 || code === 82) return "Rain Showers";
  if (code === 71 || code === 73 || code === 75) return "Snow";
  if (code === 95) return "Thunderstorm";
  if (code === 96 || code === 99) return "Thunderstorm & Hail";
  return "Unknown";
}

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
  const weather = useWeather();
  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb", padding: 0, margin: 0, fontFamily: 'Inter, Arial, sans-serif', position: "relative" }}>
      {/* Weather box fixed top right */}
      <div style={{ position: "fixed", top: 24, right: 36, zIndex: 100, background: "#fff", borderRadius: 16, padding: "18px 32px", fontSize: 32, fontWeight: 800, color: "#7c3aed", boxShadow: "0 4px 16px rgba(124,58,237,0.13)", display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: 120, border: "2px solid #e9e5f7" }}>
        <span>{weather.tempF !== null ? `${weather.tempF}°F` : "--"}</span>
        <span style={{ fontSize: 22, fontWeight: 600, color: "#22223b", marginTop: 6 }}>{weather.type ?? ""}</span>
      </div>
      {/* Header */}
      <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 24 }}>
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(124,58,237,0.07)", padding: "18px 40px", minWidth: 340 }}>
          <h1 style={{ fontSize: 38, fontWeight: 900, color: "#a855f7", margin: 0, letterSpacing: 1 }}>Boba Tea Menu</h1>
        </div>
      </div>
      {/* Menu grid */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 1200, padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 44 }}>
            {menuItems.map((item) => (
              <div key={item.id} style={{ background: "#fff", borderRadius: 20, boxShadow: "0 4px 18px rgba(124,58,237,0.13)", padding: "40px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 340, border: "3px solid #e9e5f7" }}>
                {/* Large image placeholder for each drink */}
                <div style={{ width: 180, height: 180, background: "#f3f0ff", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, overflow: "hidden" }}>
                  <span role="img" aria-label="drink" style={{ fontSize: 90 }}>🥤</span>
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#a855f7", letterSpacing: 1, marginBottom: 12 }}>DRINK · {item.id}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#22223b", marginBottom: 16, textAlign: "center" }}>{item.name}</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#a855f7" }}>${item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
