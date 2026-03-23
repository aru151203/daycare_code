import { useState } from "react";
import { MEAL_KEYS, MEAL_META, NUTRIENT_META } from "../../data/constants.js";
import { foodNutrients } from "../../data/foodLibrary.js";
import { getChildNutrition } from "../../data/helpers.js";

// Dashboard-level view of all children's nutrition.
// Default: shows 4 summary stat cards only.
// "View students" toggle reveals a table with one row per child.
// Each row has meal checkboxes (teacher ticks) + nutrition % bar.
// Click ▼ on any row to expand nutrient gap detail inline.
export default function NutritionSummaryTable({ childrenState, mealPlans, onToggleMeal, onBulkMeal }) {
  const [expandedChild, setExpandedChild] = useState(null);
  const [showTable,     setShowTable]     = useState(false);

  const stats = childrenState.reduce((acc, c) => {
    acc.mealsLogged += Object.values(c.consumed).filter(Boolean).length;
    const { pct } = getChildNutrition(c, mealPlans);
    if (pct < 50) acc.belowGoal++; else acc.onTrack++;
    return acc;
  }, { mealsLogged: 0, belowGoal: 0, onTrack: 0 });

  return (
    <div>
      {/* Summary stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Meals Logged",   value: stats.mealsLogged,    sub: `of ${childrenState.length * 3} possible`, color: "#00bea3", bg: "#E0F7F4" },
          { label: "Below 50% Goal", value: stats.belowGoal,      sub: "need attention",                          color: "#EF4444", bg: "#FEE2E2" },
          { label: "On Track",       value: stats.onTrack,        sub: "meeting daily goal",                      color: "#22C55E", bg: "#DCFCE7" },
          { label: "Children",       value: childrenState.length, sub: "checked in today",                        color: "#8B5CF6", bg: "#EDE9FE" },
        ].map((s) => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: "14px 16px" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#2D3436", marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "#64748B" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Toggle button */}
      <button onClick={() => setShowTable((s) => !s)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          background: showTable ? "#F8FAFC" : "#fff", border: "1.5px solid #E2E8F0",
          borderRadius: 12, padding: "10px 0", fontSize: 13, fontWeight: 700,
          color: "#475569", cursor: "pointer", marginBottom: showTable ? 12 : 0 }}>
        <span style={{ display: "inline-block", transform: showTable ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", fontSize: 11 }}>▼</span>
        {showTable ? "Hide students" : "View students"}
      </button>

      {/* Student table — only when expanded */}
      {showTable && (
        <div style={{ borderRadius: 14, border: "1px solid #F1F5F9", overflow: "hidden" }}>

          {/* Bulk meal marking */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "#F8FAFC", borderBottom: "1px solid #F1F5F9", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#64748B", marginRight: 4 }}>Mark all:</span>
            {MEAL_KEYS.map((mk) => {
              const meal    = MEAL_META[mk];
              const allDone = childrenState.every((c) => c.consumed[mk]);
              return (
                <button key={mk} onClick={() => onBulkMeal(mk, !allDone)}
                  style={{ fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 20, cursor: "pointer", border: "none",
                    background: allDone ? meal.color : "#fff",
                    color:      allDone ? "#fff"      : meal.color,
                    boxShadow: `inset 0 0 0 1.5px ${meal.color}` }}>
                  {allDone ? `✓ ${meal.label} Done` : `${meal.label} Done`}
                </button>
              );
            })}

          </div>

          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 72px 72px 72px 110px 36px", padding: "9px 16px", background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
            {["Child", "Breakfast", "Lunch", "Snacks", "Nutrition %", ""].map((h) => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.05em" }}>{h}</span>
            ))}
          </div>

          {childrenState.map((child, i) => {
            const { goals, consumed, pct, multiplier } = getChildNutrition(child, mealPlans);
            const below  = pct < 50;
            const isOpen = expandedChild === child.id;

            return (
              <div key={child.id} style={{ borderBottom: i < childrenState.length - 1 ? "1px solid #F1F5F9" : "none" }}>

                {/* Row */}
                <div onClick={() => setExpandedChild(isOpen ? null : child.id)}
                  style={{ display: "grid", gridTemplateColumns: "1fr 72px 72px 72px 110px 36px", padding: "10px 16px", cursor: "pointer",
                    background: isOpen ? "#F8FAFC" : below ? "#FFFBFB" : i % 2 === 0 ? "#fff" : "#FAFAFA",
                    borderLeft: below ? "3px solid #EF4444" : "3px solid transparent",
                    transition: "background 0.15s" }}>

                  {/* Name */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: child.avatarBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{child.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#2D3436" }}>{child.name}</div>
                      <div style={{ fontSize: 10, color: "#94A3B8" }}>{child.age} · {child.classroom.split(" ")[0]} · {Math.round(multiplier * 100)}% portion</div>
                    </div>
                  </div>

                  {/* Meal checkboxes — teacher ticks when child eats */}
                  {MEAL_KEYS.map((mk) => (
                    <div key={mk} style={{ display: "flex", alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={!!child.consumed[mk]} onChange={() => onToggleMeal(child.id, mk)}
                        style={{ width: 16, height: 16, cursor: "pointer", accentColor: MEAL_META[mk].color }} />
                    </div>
                  ))}

                  {/* Nutrition % bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, height: 6, background: below ? "#FEE2E2" : "#E2E8F0", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: below ? "#EF4444" : "#22C55E", borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: below ? "#DC2626" : "#15803D", minWidth: 30 }}>{pct}%</span>
                  </div>

                  {/* Expand arrow */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 12, color: "#94A3B8", display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                  </div>
                </div>

                {/* Expanded nutrient detail */}
                {isOpen && (
                  <div style={{ padding: "14px 20px 16px", background: "#F8FAFC", borderTop: "1px solid #F1F5F9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: 11, background: "#EDE9FE", color: "#6D28D9", padding: "3px 10px", borderRadius: 10, fontWeight: 600 }}>
                        {child.age} → {Math.round(multiplier * 100)}% portion of {child.classroom} meal plan
                      </span>
                      <span style={{ fontSize: 11, color: "#94A3B8" }}>Age-based goals applied automatically</span>
                    </div>

                    {/* Meal consumed cards */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                      {MEAL_KEYS.map((mk) => {
                        const meal = MEAL_META[mk];
                        const plan = mealPlans[child.classroom]?.[mk];
                        const mn   = plan ? foodNutrients(plan.foods, multiplier) : { protein: 0, carbs: 0, fat: 0, fiber: 0 };
                        return (
                          <div key={mk} style={{ flex: 1, borderRadius: 10, padding: "10px 12px",
                            background: child.consumed[mk] ? meal.bg : "#fff",
                            border: `1.5px solid ${child.consumed[mk] ? meal.color : "#E2E8F0"}`,
                            opacity: child.consumed[mk] ? 1 : 0.6 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: child.consumed[mk] ? meal.color : "#94A3B8" }}>{meal.label}</span>
                              <span style={{ width: 14, height: 14, borderRadius: "50%", background: child.consumed[mk] ? "#22C55E" : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {child.consumed[mk] && <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>✓</span>}
                              </span>
                            </div>
                            <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 4 }}>{meal.time}</div>
                            <div style={{ fontSize: 10, color: "#64748B" }}>P:{mn.protein}g · C:{mn.carbs}g · F:{mn.fat}g</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Nutrient gap grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                      {Object.entries(NUTRIENT_META).map(([key, meta]) => {
                        const got  = consumed[key];
                        const goal = goals[key];
                        const p    = goal > 0 ? Math.min(100, Math.round((got / goal) * 100)) : 0;
                        const gap  = goal - got;
                        const low  = p < 50;
                        return (
                          <div key={key} style={{ background: "#fff", borderRadius: 10, padding: "10px 12px", border: `1px solid ${low ? "#FECDD3" : "#F1F5F9"}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5 }}>
                              <span style={{ width: 7, height: 7, borderRadius: "50%", background: meta.color, display: "inline-block" }} />
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#64748B", flex: 1 }}>{meta.label}</span>
                              {low && <span style={{ fontSize: 9, fontWeight: 700, background: "#FEE2E2", color: "#DC2626", padding: "1px 5px", borderRadius: 5 }}>LOW</span>}
                            </div>
                            <div style={{ height: 5, background: meta.trackColor, borderRadius: 3, overflow: "hidden", marginBottom: 5 }}>
                              <div style={{ height: "100%", width: `${p}%`, background: low ? "#EF4444" : meta.color, borderRadius: 3 }} />
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ fontSize: 12, fontWeight: 800, color: low ? "#DC2626" : "#2D3436" }}>{got}g<span style={{ fontSize: 10, fontWeight: 400, color: "#94A3B8" }}>/{goal}g</span></span>
                              <span style={{ fontSize: 10, fontWeight: 700, color: gap > 0 ? "#F97316" : "#22C55E" }}>{gap > 0 ? `${gap}g short` : "✓ Met"}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
