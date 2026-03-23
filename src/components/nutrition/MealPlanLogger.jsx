import { useState } from "react";
import { MEAL_KEYS, MEAL_META, NUTRIENT_META } from "../../data/constants.js";
import { FOOD_LIBRARY, foodNutrients } from "../../data/foodLibrary.js";

// Teacher logs food items once per classroom.
// All children in that classroom share the same food items.
// Portion sizes are automatically scaled per child based on age (in helpers.js).
export default function MealPlanLogger({ mealPlans, onUpdate }) {
  const classrooms   = Object.keys(mealPlans);
  const [activeRoom, setActiveRoom]   = useState(classrooms[0]);
  const [editingMeal, setEditingMeal] = useState(null);
  const [search, setSearch]           = useState("");

  const plan     = mealPlans[activeRoom];
  const filtered = FOOD_LIBRARY.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  const toggleFood = (foodId) => {
    const curr = plan[editingMeal].foods;
    onUpdate(
      activeRoom,
      editingMeal,
      curr.includes(foodId) ? curr.filter((id) => id !== foodId) : [...curr, foodId]
    );
  };

  return (
    <div style={{ background: "#F8FAFC", borderRadius: 14, padding: "16px 18px", border: "1px solid #F1F5F9", marginBottom: 20 }}>

      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 14 }}>📋</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#2D3436" }}>Classroom Meal Plans</span>
      </div>

      {/* Classroom tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {classrooms.map((room) => (
          <button key={room} onClick={() => { setActiveRoom(room); setEditingMeal(null); }}
            style={{ fontSize: 11, fontWeight: 700, padding: "5px 14px", borderRadius: 20, cursor: "pointer", border: "none",
              background: activeRoom === room ? "#2D3436" : "#fff",
              color:      activeRoom === room ? "#fff"    : "#64748B",
              boxShadow:  activeRoom === room ? "0 1px 4px rgba(0,0,0,0.12)" : "none" }}>
            {room}
          </button>
        ))}
      </div>

      {/* 3 meal columns */}
      <div style={{ display: "flex", gap: 10 }}>
        {MEAL_KEYS.map((mk) => {
          const meal      = MEAL_META[mk];
          const foods     = plan[mk].foods;
          const isEditing = editingMeal === mk;
          const nutrients = foodNutrients(foods, 1); // full portion for display

          return (
            <div key={mk} style={{ flex: 1, borderRadius: 12, background: meal.bg, borderTop: `3px solid ${meal.color}`, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 10, color: "#64748B" }}>{meal.time}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: meal.color }}>{meal.label}</div>
                </div>
                <button onClick={() => { setEditingMeal(isEditing ? null : mk); setSearch(""); }}
                  style={{ fontSize: 10, fontWeight: 700, background: "#fff", border: `1px solid ${meal.border}`, color: meal.color, borderRadius: 12, padding: "3px 9px", cursor: "pointer" }}>
                  {isEditing ? "Done" : "✏ Edit"}
                </button>
              </div>

              {/* Food tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8, minHeight: 22 }}>
                {foods.length === 0
                  ? <span style={{ fontSize: 10, color: "#94A3B8" }}>No items added</span>
                  : foods.map((id) => {
                      const f = FOOD_LIBRARY.find((x) => x.id === id);
                      return f ? (
                        <span key={id} style={{ fontSize: 10, background: "rgba(0,0,0,0.07)", color: "#475569", padding: "2px 7px", borderRadius: 8 }}>
                          {f.name}
                        </span>
                      ) : null;
                    })}
              </div>

              {/* Nutrient totals at full portion */}
              <div style={{ display: "flex", gap: 4 }}>
                {Object.entries(NUTRIENT_META).map(([k, meta]) => (
                  <div key={k} style={{ flex: 1, textAlign: "center", background: "rgba(255,255,255,0.7)", borderRadius: 6, padding: "3px 2px" }}>
                    <div style={{ fontSize: 9, color: "#94A3B8" }}>{meta.label.slice(0, 3)}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: meta.color }}>{nutrients[k]}g</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Age portion legend */}
      <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
        {[
          { label: "Age 1–3 yrs", mult: "60%", color: "#E0F7F4" },
          { label: "Age 4–5 yrs", mult: "80%", color: "#EDE9FE" },
          { label: "Age 6+ yrs",  mult: "100%", color: "#DCFCE7" },
        ].map((a) => (
          <span key={a.label} style={{ fontSize: 10, background: a.color, color: "#475569", padding: "3px 10px", borderRadius: 10, fontWeight: 600 }}>
            {a.label} → {a.mult} portion
          </span>
        ))}
        <span style={{ fontSize: 10, color: "#94A3B8", alignSelf: "center", marginLeft: 4 }}>Nutrient goals also scale by age</span>
      </div>

      {/* Food picker (shown when editing a meal) */}
      {editingMeal && (
        <div style={{ marginTop: 12, background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #F1F5F9" }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍  Search food..."
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #E2E8F0", fontSize: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          </div>
          <div style={{ padding: "10px 14px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, maxHeight: 180, overflowY: "auto" }}>
            {filtered.map((food) => {
              const selected = plan[editingMeal].foods.includes(food.id);
              return (
                <div key={food.id} onClick={() => toggleFood(food.id)}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 10px", borderRadius: 8, cursor: "pointer",
                    background: selected ? "#F0FDF4" : "#F8FAFC",
                    border: `1px solid ${selected ? "#86EFAC" : "#F1F5F9"}` }}>
                  <div style={{ width: 13, height: 13, borderRadius: 3, border: `2px solid ${selected ? "#22C55E" : "#CBD5E1"}`, background: selected ? "#22C55E" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {selected && <span style={{ color: "#fff", fontSize: 8, fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 11, color: "#2D3436", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{food.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
