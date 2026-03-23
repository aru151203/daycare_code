import { useState, useRef, useEffect } from "react";
import { MEAL_KEYS }     from "../data/constants.js";
import { getChildFlags } from "../data/helpers.js";

export default function ChildSearch({ childrenState, mealPlans, onSelectChild }) {
  const [query,    setQuery]    = useState("");
  const [filter,   setFilter]   = useState("All");
  const [showDrop, setShowDrop] = useState(false);
  const wrapperRef = useRef(null);

  const classrooms = ["All", ...new Set(childrenState.map((c) => c.classroom))];

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setShowDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = childrenState.filter((c) => {
    const matchName = c.name.toLowerCase().includes(query.toLowerCase());
    const matchRoom = filter === "All" || c.classroom === filter;
    return matchName && matchRoom;
  });

  const shouldShowDrop = showDrop && filtered.length > 0;

  const handleSelect = (childId) => {
    onSelectChild(childId);
    setQuery("");
    setShowDrop(false);
  };

  const alertCount  = childrenState.filter((c) => getChildFlags(c, mealPlans).length > 0).length;
  const normalCount = childrenState.length - alertCount;

  return (
    <div style={{ padding: "20px 32px 0" }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: "#94A3B8" }}>
          <strong style={{ color: "#2D3436" }}>{childrenState.length} children</strong> checked in today
          &nbsp;·&nbsp;
          <span style={{ color: "#EF4444", fontWeight: 600 }}>⚠ {alertCount} alerts</span>
          &nbsp;·&nbsp;
          <span style={{ color: "#22C55E", fontWeight: 600 }}>✓ {normalCount} normal</span>
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {classrooms.map((room) => (
            <button key={room} onClick={() => setFilter(room)}
              style={{ fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20, cursor: "pointer", border: "none",
                background: filter === room ? "#2D3436" : "#fff",
                color:      filter === room ? "#fff"    : "#64748B",
                boxShadow:  filter === room ? "0 1px 4px rgba(0,0,0,0.12)" : "0 1px 3px rgba(0,0,0,0.06)" }}>
              {room === "All" ? "All Rooms" : room.replace(" Room", "")}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar + dropdown */}
      <div ref={wrapperRef} style={{ position: "relative", maxWidth: 420 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 12, padding: "10px 14px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1.5px solid #E2E8F0" }}>
          <span style={{ fontSize: 16, color: "#94A3B8" }}>🔍</span>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDrop(true); }}
            onFocus={() => setShowDrop(true)}
            placeholder="Search child by name..."
            style={{ flex: 1, border: "none", outline: "none", fontSize: 13, fontFamily: "inherit", color: "#2D3436", background: "transparent" }}
          />
          {query && (
            <button onClick={() => { setQuery(""); setShowDrop(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", fontSize: 14, padding: 0 }}>✕</button>
          )}
        </div>

        {shouldShowDrop && (
          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", borderRadius: 14, boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid #F1F5F9", zIndex: 200, overflow: "hidden", maxHeight: 320, overflowY: "auto" }}>
            <div style={{ padding: "8px 14px", borderBottom: "1px solid #F1F5F9", fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>
              {filtered.length} student{filtered.length !== 1 ? "s" : ""} found
            </div>
            {filtered.map((c) => {
              const flags       = getChildFlags(c, mealPlans);
              const mealsLogged = MEAL_KEYS.filter((k) => c.consumed[k]).length;
              const hasAlert    = flags.length > 0;
              return (
                <div key={c.id} onClick={() => handleSelect(c.id)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid #F9FAFB", background: "#fff", transition: "background 0.1s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFC"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: c.avatarBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>{c.name[0]}</div>
                    {hasAlert && (
                      <span style={{ position: "absolute", top: -2, right: -2, width: 12, height: 12, background: "#EF4444", borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, color: "#fff", fontWeight: 700 }}>{flags.length}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#2D3436" }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{c.age} · {c.classroom}</div>
                  </div>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {MEAL_KEYS.map((mk) => (
                      <span key={mk} style={{ width: 8, height: 8, borderRadius: "50%", display: "inline-block", background: c.consumed[mk] ? "#22C55E" : "#E2E8F0" }} />
                    ))}
                    <span style={{ fontSize: 10, color: "#94A3B8", marginLeft: 2 }}>{mealsLogged}/3</span>
                  </div>
                  {hasAlert
                    ? <span style={{ fontSize: 10, fontWeight: 700, background: "#FEE2E2", color: "#DC2626", padding: "2px 8px", borderRadius: 8, border: "1px solid #FCA5A5", whiteSpace: "nowrap" }}>⚠ Alert</span>
                    : <span style={{ fontSize: 10, fontWeight: 700, background: "#DCFCE7", color: "#15803D", padding: "2px 8px", borderRadius: 8, border: "1px solid #BBF7D0", whiteSpace: "nowrap" }}>✓ Good</span>}
                  <span style={{ fontSize: 11, color: "#CBD5E1" }}>→</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div style={{ marginTop: 8, fontSize: 11, color: "#94A3B8" }}>
        Type a name to find a child · filter by classroom above · click to open their profile
      </div>
    </div>
  );
}