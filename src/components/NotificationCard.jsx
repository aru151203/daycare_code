import { useState } from "react";
import { getChildFlags } from "../data/helpers.js";

// Auto-scans all children and surfaces anyone with:
//   • health alerts (any vital flagged)
//   • 2+ skipped meals
//   • overall nutrition < 50% of daily goal
// Dismissible per child. Clicking a child name navigates to their profile.
export default function NotificationCard({ childrenState, mealPlans, onSelectChild }) {
  const [dismissed, setDismissed] = useState([]);

  const flagged = childrenState
    .map((c) => ({ child: c, flags: getChildFlags(c, mealPlans) }))
    .filter(({ child, flags }) => flags.length > 0 && !dismissed.includes(child.id));

  const criticalCount = flagged.filter(({ flags }) => flags.some((f) => f.severity === "critical")).length;
  const warningCount  = flagged.length - criticalCount;

  // All clear state
  if (flagged.length === 0) return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 14, padding: "12px 20px", marginBottom: 20 }}>
      <span style={{ fontSize: 18 }}>✅</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#15803D" }}>All Clear — All children are healthy and meals are on track.</span>
    </div>
  );

  return (
    <div style={{ background: "#fff", border: "1.5px solid #FECDD3", borderRadius: 16, marginBottom: 20, overflow: "hidden", boxShadow: "0 2px 10px rgba(239,68,68,0.08)" }}>

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderBottom: "1px solid #FEE2E2", background: "#FFF8F8" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FEE2E2", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 16 }}>🔔</span>
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#2D3436" }}>Attention Required</span>
          <span style={{ fontSize: 12, color: "#94A3B8", marginLeft: 8 }}>{flagged.length} student{flagged.length > 1 ? "s" : ""} flagged today</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {criticalCount > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, background: "#FEE2E2", color: "#DC2626", padding: "3px 10px", borderRadius: 20, border: "1px solid #FCA5A5" }}>
              🏥 {criticalCount} critical
            </span>
          )}
          {warningCount > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, background: "#FEF3C7", color: "#B45309", padding: "3px 10px", borderRadius: 20, border: "1px solid #FCD34D" }}>
              ⚠ {warningCount} warning{warningCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Bullet list — one line per flagged child */}
      <div style={{ padding: "10px 20px 12px" }}>
        {flagged.map(({ child, flags }) => {
          const isCritical = flags.some((f) => f.severity === "critical");
          return (
            <div key={child.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid #FEF2F2" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: isCritical ? "#EF4444" : "#F59E0B", flexShrink: 0, display: "inline-block" }} />

              {/* Clickable name → child profile */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 120, cursor: "pointer" }} onClick={() => onSelectChild(child.id)}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: child.avatarBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10 }}>
                  {child.name[0]}
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: child.avatarBg, textDecoration: "underline", textDecorationStyle: "dotted" }}>
                  {child.name.split(" ")[0]}
                </span>
              </div>

              {/* Flag summary — one line */}
              <span style={{ fontSize: 12, color: "#475569", flex: 1 }}>
                {flags.map((f, i) => (
                  <span key={i}>
                    <span style={{ color: f.severity === "critical" ? "#DC2626" : "#B45309", fontWeight: 600 }}>{f.icon} {f.label}</span>
                    {i < flags.length - 1 && <span style={{ color: "#CBD5E1" }}> · </span>}
                  </span>
                ))}
              </span>

              {/* Dismiss */}
              <button onClick={() => setDismissed((d) => [...d, child.id])}
                style={{ background: "none", border: "none", color: "#CBD5E1", cursor: "pointer", fontSize: 13 }}>✕</button>
            </div>
          );
        })}
        <div style={{ fontSize: 10, color: "#CBD5E1", marginTop: 8, textAlign: "right" }}>
          Thresholds: 2+ skipped meals · &lt;50% daily nutrition · health alerts
        </div>
      </div>
    </div>
  );
}
