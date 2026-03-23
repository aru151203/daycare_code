import { MEAL_KEYS, MEAL_META, NUTRIENT_META } from "../../data/constants.js";
import { foodNutrients } from "../../data/foodLibrary.js";
import { getChildNutrition, hasHealthAlerts } from "../../data/helpers.js";
import MedicalUpdates, { AddMedicalModal } from "../medical/MedicalUpdates.jsx";
import { useState } from "react";

// Full individual profile page — shown when teacher clicks a child from the top row.
// Contains only that child's:
//   • Profile header (name, age, classroom, status badges)
//   • Nutrition tracking (meal cards + nutrient gap grid)
//   • Health vitals (read-only 2×2 grid)
//   • Medical updates (filtered to this child only)
// No notification card, no other children.
export default function ChildProfilePage({ child, mealPlans, medicalUpdates, setMedicalUpdates, onBack, childrenState }) {
  const { goals, consumed, pct, multiplier } = getChildNutrition(child, mealPlans);
  const below       = pct < 50;
  const [showModal, setShowModal] = useState(false);

  return (
    <div style={{ padding: "0 32px 48px" }}>

      {/* ── Profile Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", borderRadius: 18, padding: "22px 24px", marginBottom: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: child.avatarBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24, flexShrink: 0 }}>
          {child.name[0]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#2D3436" }}>{child.name}</div>
          <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>{child.age} · {child.classroom} · {child.teacher}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {hasHealthAlerts(child)
              ? <span style={{ fontSize: 11, fontWeight: 700, background: "#FEE2E2", color: "#DC2626", padding: "3px 10px", borderRadius: 10, border: "1px solid #FCA5A5" }}>⚠ Health alert</span>
              : <span style={{ fontSize: 11, fontWeight: 700, background: "#DCFCE7", color: "#15803D", padding: "3px 10px", borderRadius: 10, border: "1px solid #BBF7D0" }}>✓ Healthy</span>}
            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 10, border: `1px solid ${below ? "#FCA5A5" : "#BBF7D0"}`, background: below ? "#FEE2E2" : "#DCFCE7", color: below ? "#DC2626" : "#15803D" }}>
              {pct}% nutrition goal
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, background: "#F1F5F9", color: "#475569", padding: "3px 10px", borderRadius: 10, border: "1px solid #E2E8F0" }}>
              {MEAL_KEYS.filter((k) => child.consumed[k]).length}/3 meals today
            </span>
          </div>
        </div>
        <button onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "#F1F5F9", border: "none", borderRadius: 20, padding: "8px 18px", fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer" }}>
          ← Back to Dashboard
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Nutrition Tracking ── */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "22px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>🍽️</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em" }}>TODAY'S MEALS</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#2D3436" }}>Nutrition Tracking</div>
              </div>
            </div>
            <span style={{ fontSize: 12, color: "#94A3B8", background: "#F8FAFC", padding: "4px 10px", borderRadius: 20, border: "1px solid #E2E8F0" }}>Mar 25, 2026</span>
          </div>

          {/* Portion info badge */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 11, background: "#EDE9FE", color: "#6D28D9", padding: "3px 10px", borderRadius: 10, fontWeight: 600 }}>
              {child.age} → {Math.round(multiplier * 100)}% portion of {child.classroom} meal plan
            </span>
            <span style={{ fontSize: 11, color: "#94A3B8", alignSelf: "center" }}>Age-based goals applied (WHO guidelines)</span>
          </div>

          {/* Meal cards */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            {MEAL_KEYS.map((mk) => {
              const meal = MEAL_META[mk];
              const plan = mealPlans[child.classroom]?.[mk];
              const mn   = plan ? foodNutrients(plan.foods, multiplier) : { protein: 0, carbs: 0, fat: 0, fiber: 0 };
              return (
                <div key={mk} style={{ flex: 1, borderRadius: 12, padding: "12px 14px",
                  background: child.consumed[mk] ? meal.bg : "#fff",
                  border: `1.5px solid ${child.consumed[mk] ? meal.color : "#E2E8F0"}`,
                  opacity: child.consumed[mk] ? 1 : 0.6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: child.consumed[mk] ? meal.color : "#94A3B8" }}>{meal.label}</span>
                    <span style={{ width: 16, height: 16, borderRadius: "50%", background: child.consumed[mk] ? "#22C55E" : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {child.consumed[mk] && <span style={{ color: "#fff", fontSize: 9, fontWeight: 700 }}>✓</span>}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 6 }}>{meal.time}</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>P:{mn.protein}g · C:{mn.carbs}g · F:{mn.fat}g · Fi:{mn.fiber}g</div>
                </div>
              );
            })}
          </div>

          {/* Nutrient gap grid */}
          <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "14px 16px", border: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#2D3436" }}>Daily Nutrient Progress</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: below ? "#DC2626" : "#22C55E" }}>{pct}% of daily goal</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
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
                      <span style={{ fontSize: 12, fontWeight: 800, color: low ? "#DC2626" : "#2D3436" }}>
                        {got}g<span style={{ fontSize: 10, fontWeight: 400, color: "#94A3B8" }}>/{goal}g</span>
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: gap > 0 ? "#F97316" : "#22C55E" }}>
                        {gap > 0 ? `${gap}g short` : "✓ Met"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Health Status ── */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "22px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>💚</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em" }}>VITALS &amp; WELLNESS</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#2D3436" }}>Health Status</div>
              </div>
            </div>
            <button style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#475569", cursor: "pointer" }}>Realtime check</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {Object.entries(child.health).map(([key, v]) => (
              <div key={key} style={{ background: v.ok ? "#F8FAFC" : "#FFF5F5", borderRadius: 12, padding: "14px 16px", border: `1px solid ${v.ok ? "#F1F5F9" : "#FECDD3"}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{v.icon}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.06em" }}>{v.label.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: v.ok ? "#2D3436" : "#DC2626", marginBottom: 8 }}>{v.value}</div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20, display: "inline-block",
                  background: v.ok ? "#DCFCE7" : "#FEE2E2",
                  color:      v.ok ? "#15803D" : "#DC2626",
                  border:     `1px solid ${v.ok ? "#BBF7D0" : "#FCA5A5"}` }}>
                  {v.ok ? "Good" : "Needs Attention"}
                </span>
                {!v.ok && v.alert && <div style={{ fontSize: 11, color: "#B45309", marginTop: 6 }}>⚠ {v.alert}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ── Medical Updates (this child only) ── */}
        <MedicalUpdates
          medicalUpdates={medicalUpdates}
          setMedicalUpdates={setMedicalUpdates}
          childrenState={childrenState}
          filterChildId={child.id}
          onAddClick={() => setShowModal(true)}
        />
      </div>

      {showModal && (
        <AddMedicalModal
          onClose={() => setShowModal(false)}
          onAdd={(e) => setMedicalUpdates((p) => [e, ...p])}
          childrenState={childrenState}
        />
      )}
    </div>
  );
}
