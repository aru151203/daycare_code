import React from "react";

// Shared header used across both dashboard and child profile views
export default function Header() {
  return (
    <header style={{ background: "#fff", borderBottom: "1px solid #F0E8E2", padding: "12px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="10" fill="#00bea3" />
          <path d="M16 8C13 8 10 10.5 10 14C10 17 12 19 14 20.5V24H18V20.5C20 19 22 17 22 14C22 10.5 19 8 16 8Z" fill="white" opacity="0.9" />
        </svg>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#1A2B3C" }}>Little Dreamers</div>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>Daycare Management Dashboard</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Notification bell */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <span style={{ fontSize: 20 }}>🔔</span>
          <span style={{ position: "absolute", top: 1, right: 1, width: 8, height: 8, background: "#EF4444", borderRadius: "50%", border: "1.5px solid #fff", display: "inline-block" }} />
        </div>
        {/* Logged-in teacher */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#2D3436" }}>Ms. Sarah</span>
          <span style={{ fontSize: 11, color: "#94A3B8" }}>Class Teacher</span>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#00bea3", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>S</div>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", fontSize: 13 }}>↪ Logout</button>
      </div>
    </header>
  );
}
