import { useState } from "react";
import { hasHealthAlerts } from "../../data/helpers.js";

// ─── ClassroomGroup ───────────────────────────────────────────────────────────
// One collapsible section per classroom in the Health Status panel.
// Collapsed by default — click ▼ to expand children list.
// Per child row:
//   • Click child NAME  → navigates to their profile (setSelectedChild)
//   • Click ▼ ARROW     → expands vitals for inline editing (separate state)
// Teacher can type a new value or toggle Good/Attention per vital.
export function ClassroomGroup({ classroom, children, selectedChild, setSelectedChild, onUpdateHealth }) {
  const alertCount     = children.filter(hasHealthAlerts).length;
  const [open, setOpen]               = useState(false);
  const [expandedVitals, setExpandedVitals] = useState(null); // separate from profile nav

  return (
    <div style={{ borderRadius: 14, border: `1.5px solid ${alertCount > 0 ? "#FECDD3" : "#E2E8F0"}`, overflow: "hidden", marginBottom: 12 }}>

      {/* Classroom header row */}
      <div onClick={() => setOpen((o) => !o)}
        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", cursor: "pointer",
          background: alertCount > 0 ? "#FFF8F8" : "#F8FAFC",
          borderBottom: open ? `1px solid ${alertCount > 0 ? "#FECDD3" : "#E2E8F0"}` : "none" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#2D3436" }}>{classroom}</div>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>{children.length} students</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {alertCount > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, background: "#FEE2E2", color: "#DC2626", padding: "3px 10px", borderRadius: 20, border: "1px solid #FCA5A5" }}>
              ⚠ {alertCount} alert{alertCount > 1 ? "s" : ""}
            </span>
          )}
          <span style={{ fontSize: 11, fontWeight: 700, background: "#DCFCE7", color: "#15803D", padding: "3px 10px", borderRadius: 20, border: "1px solid #BBF7D0" }}>
            ✓ {children.length - alertCount} good
          </span>
        </div>
        <span style={{ fontSize: 11, color: "#94A3B8", display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
      </div>

      {/* Children list */}
      {open && (
        <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
          {children.map((child) => {
            const isExpanded = expandedVitals === child.id;
            const alerts     = hasHealthAlerts(child);

            return (
              <div key={child.id}>
                {/* Child row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10,
                  background: isExpanded ? `${child.avatarBg}10` : "#fff",
                  border: `1.5px solid ${isExpanded ? child.avatarBg : alerts ? "#FECDD3" : "#F1F5F9"}` }}>

                  {/* Name → profile */}
                  <div onClick={() => setSelectedChild(child.id)}
                    style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, cursor: "pointer" }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: child.avatarBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
                      {child.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#00bea3", textDecoration: "underline", textDecorationStyle: "dotted" }}>{child.name}</div>
                      <div style={{ fontSize: 10, color: "#94A3B8" }}>{child.age}</div>
                    </div>
                  </div>

                  {/* Vital dots */}
                  <div style={{ display: "flex", gap: 4 }}>
                    {Object.entries(child.health).map(([k, v]) => (
                      <span key={k} title={`${v.label}: ${v.value}`}
                        style={{ width: 8, height: 8, borderRadius: "50%", display: "inline-block", background: v.ok ? "#22C55E" : "#EF4444" }} />
                    ))}
                  </div>

                  {/* Status badge */}
                  {alerts
                    ? <span style={{ fontSize: 10, fontWeight: 700, background: "#FEE2E2", color: "#DC2626", padding: "2px 8px", borderRadius: 8, border: "1px solid #FCA5A5" }}>⚠ Attention</span>
                    : <span style={{ fontSize: 10, fontWeight: 700, background: "#DCFCE7", color: "#15803D", padding: "2px 8px", borderRadius: 8, border: "1px solid #BBF7D0" }}>✓ Good</span>}

                  {/* ▼ arrow → expand vitals */}
                  <span onClick={() => setExpandedVitals(isExpanded ? null : child.id)}
                    style={{ fontSize: 11, color: "#94A3B8", cursor: "pointer", padding: "0 4px", display: "inline-block",
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼
                  </span>
                </div>

                {/* Editable vitals (expanded inline) */}
                {isExpanded && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6, padding: "0 4px 6px" }}>
                    {Object.entries(child.health).map(([key, v]) => (
                      <div key={key} style={{ background: "#fff", borderRadius: 10, padding: "10px 12px", border: `1px solid ${v.ok ? "#F1F5F9" : "#FECDD3"}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                          <span style={{ fontSize: 14 }}>{v.icon}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.05em", flex: 1 }}>{v.label.toUpperCase()}</span>
                        </div>
                        {/* Editable value — teacher types new reading */}
                        <input value={v.value}
                          onChange={(e) => onUpdateHealth(child.id, key, "value", e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          style={{ width: "100%", fontSize: 13, fontWeight: 700, color: v.ok ? "#2D3436" : "#DC2626", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "5px 8px", outline: "none", fontFamily: "inherit", boxSizing: "border-box", marginBottom: 6 }} />
                        {/* Good / Attention toggle */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={(e) => e.stopPropagation()}>
                          <span style={{ fontSize: 10, color: "#64748B" }}>Status:</span>
                          <button onClick={() => onUpdateHealth(child.id, key, "ok", !v.ok)}
                            style={{ fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 8, border: "none", cursor: "pointer",
                              background: v.ok ? "#DCFCE7" : "#FEE2E2",
                              color:      v.ok ? "#15803D" : "#DC2626" }}>
                            {v.ok ? "✓ Good" : "⚠ Attention"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── HealthStatusPanel ────────────────────────────────────────────────────────
// Groups all children by classroom. Each group is collapsed by default.
export default function HealthStatusPanel({ childrenState, selectedChild, setSelectedChild, onUpdateHealth }) {
  const classrooms  = [...new Set(childrenState.map((c) => c.classroom))];
  const totalAlerts = childrenState.filter(hasHealthAlerts).length;

  return (
    <div style={{ borderRadius: 18, background: "#fff", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", padding: "22px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>💚</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em" }}>VITALS &amp; WELLNESS</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#2D3436" }}>Health Status</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {totalAlerts > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, background: "#FEE2E2", color: "#DC2626", padding: "3px 10px", borderRadius: 20, border: "1px solid #FCA5A5" }}>
              ⚠ {totalAlerts} alert{totalAlerts > 1 ? "s" : ""}
            </span>
          )}
          <button style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#475569", cursor: "pointer" }}>
            Realtime check
          </button>
        </div>
      </div>

      {classrooms.map((room) => (
        <ClassroomGroup
          key={room}
          classroom={room}
          children={childrenState.filter((c) => c.classroom === room)}
          selectedChild={selectedChild}
          setSelectedChild={setSelectedChild}
          onUpdateHealth={onUpdateHealth}
        />
      ))}
    </div>
  );
}
