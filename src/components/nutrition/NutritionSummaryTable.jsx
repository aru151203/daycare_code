import { useState } from "react";
import { MEAL_KEYS, MEAL_META, NUTRIENT_META } from "../../data/constants.js";
import { foodNutrients } from "../../data/foodLibrary.js";
import { getChildNutrition } from "../../data/helpers.js";

// Shows summary stats + a per-child table with meal checkboxes and nutrition bars.
// Teacher ticks checkboxes when a child eats a meal.
// Click a row to expand and see the detailed nutrient breakdown.
export default function NutritionSummaryTable({ childrenState, mealPlans, onToggleMeal, onBulkMeal }) {
  const [expandedChild, setExpandedChild] = useState(null);
  const [showTable, setShowTable] = useState(false);

  // Count summary stats across all children
  const stats = childrenState.reduce(
    (acc, child) => {
      acc.mealsLogged += Object.values(child.consumed).filter(Boolean).length;
      const { pct } = getChildNutrition(child, mealPlans);
      if (pct < 50) acc.belowGoal++;
      else acc.onTrack++;
      return acc;
    },
    { mealsLogged: 0, belowGoal: 0, onTrack: 0 }
  );

  return (
    <div>
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Meals Logged",   value: stats.mealsLogged,    sub: `of ${childrenState.length * 3} possible`, color: "#00bea3", bg: "#e6f9f6" },
          { label: "Below 50% Goal", value: stats.belowGoal,      sub: "need attention",                          color: "#ef4444", bg: "#fee2e2" },
          { label: "On Track",       value: stats.onTrack,        sub: "meeting daily goal",                      color: "#00bea3", bg: "#e6f9f6" },
          { label: "Children",       value: childrenState.length, sub: "checked in today",                        color: "#ff6d34", bg: "#fff3ee" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl p-4" style={{ background: card.bg }}>
            <div className="text-2xl font-extrabold" style={{ color: card.color }}>{card.value}</div>
            <div className="text-xs font-bold text-gray-800 mt-0.5">{card.label}</div>
            <div className="text-xs text-gray-500">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Toggle to show/hide the student table */}
      <button
        onClick={() => setShowTable((s) => !s)}
        className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl py-2.5 text-sm font-bold text-gray-600 cursor-pointer"
        style={{ marginBottom: showTable ? 12 : 0 }}
      >
        <span style={{ display: "inline-block", transform: showTable ? "rotate(180deg)" : "none", transition: "transform 0.2s", fontSize: 11 }}>▼</span>
        {showTable ? "Hide students" : "View students"}
      </button>

      {/* Student table */}
      {showTable && (
        <div className="rounded-xl border border-gray-100 overflow-hidden mt-3">

          {/* Bulk mark-all row */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 mr-1">Mark all:</span>
            {MEAL_KEYS.map((mk) => {
              const meal = MEAL_META[mk];
              const allDone = childrenState.every((c) => c.consumed[mk]);
              return (
                <button
                  key={mk}
                  onClick={() => onBulkMeal(mk, !allDone)}
                  className="text-xs font-bold px-3 py-1 rounded-full border-none cursor-pointer"
                  style={{
                    background: allDone ? meal.color : "#fff",
                    color: allDone ? "#fff" : meal.color,
                    boxShadow: `inset 0 0 0 1.5px ${meal.color}`
                  }}
                >
                  {allDone ? `✓ ${meal.label} Done` : `${meal.label} Done`}
                </button>
              );
            })}
          </div>

          {/* Column headers */}
          <div className="grid px-4 py-2 bg-gray-50 border-b border-gray-100" style={{ gridTemplateColumns: "1fr 72px 72px 72px 110px 36px" }}>
            {["Child", "Breakfast", "Lunch", "Snacks", "Nutrition %", ""].map((heading) => (
              <span key={heading} className="text-xs font-bold text-gray-400 tracking-wide">{heading}</span>
            ))}
          </div>

          {/* One row per child */}
          {childrenState.map((child, i) => {
            const { goals, consumed, pct, multiplier } = getChildNutrition(child, mealPlans);
            const isBelow = pct < 50;
            const isOpen = expandedChild === child.id;

            return (
              <div key={child.id} className={i < childrenState.length - 1 ? "border-b border-gray-100" : ""}>

                {/* Main row */}
                <div
                  onClick={() => setExpandedChild(isOpen ? null : child.id)}
                  className="grid px-4 py-2.5 cursor-pointer transition-colors"
                  style={{
                    gridTemplateColumns: "1fr 72px 72px 72px 110px 36px",
                    background: isOpen ? "#fafafa" : isBelow ? "#fffbfb" : i % 2 === 0 ? "#fff" : "#fafafa",
                    borderLeft: isBelow ? "3px solid #ef4444" : "3px solid transparent"
                  }}
                >
                  {/* Child name with avatar */}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#00bea3] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {child.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">{child.name}</div>
                      <div className="text-xs text-gray-400">
                        {child.age} · {child.classroom.split(" ")[0]} · {Math.round(multiplier * 100)}% portion
                      </div>
                    </div>
                  </div>

                  {/* Meal checkboxes */}
                  {MEAL_KEYS.map((mk) => (
                    <div key={mk} className="flex items-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={!!child.consumed[mk]}
                        onChange={() => onToggleMeal(child.id, mk)}
                        className="w-4 h-4 cursor-pointer"
                        style={{ accentColor: MEAL_META[mk].color }}
                      />
                    </div>
                  ))}

                  {/* Nutrition progress bar */}
                  <div className="flex items-center gap-1.5">
                    <div
                      className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ background: isBelow ? "#fee2e2" : "#e5e7eb" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, background: isBelow ? "#ef4444" : "#00bea3" }}
                      />
                    </div>
                    <span
                      className="text-xs font-bold min-w-8"
                      style={{ color: isBelow ? "#ef4444" : "#00bea3" }}
                    >
                      {pct}%
                    </span>
                  </div>

                  {/* Expand arrow */}
                  <div className="flex items-center justify-center">
                    <span
                      className="text-xs text-gray-400 inline-block transition-transform"
                      style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                    >▼</span>
                  </div>
                </div>

                {/* Expanded nutrient detail */}
                {isOpen && (
                  <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs bg-[#fff3ee] text-[#ff6d34] px-3 py-1 rounded-lg font-semibold">
                        {child.age} → {Math.round(multiplier * 100)}% portion of {child.classroom} meal plan
                      </span>
                      <span className="text-xs text-gray-400">Age-based goals applied automatically</span>
                    </div>

                    {/* Meal cards */}
                    <div className="flex gap-2 mb-4">
                      {MEAL_KEYS.map((mk) => {
                        const meal = MEAL_META[mk];
                        const mealPlan = mealPlans[child.classroom]?.[mk];
                        const nutrients = mealPlan
                          ? foodNutrients(mealPlan.foods, multiplier)
                          : { protein: 0, carbs: 0, fat: 0, fiber: 0 };

                        return (
                          <div
                            key={mk}
                            className="flex-1 rounded-xl p-3"
                            style={{
                              background: child.consumed[mk] ? meal.bg : "#fff",
                              border: `1.5px solid ${child.consumed[mk] ? meal.color : "#e5e7eb"}`,
                              opacity: child.consumed[mk] ? 1 : 0.6
                            }}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold" style={{ color: child.consumed[mk] ? meal.color : "#9ca3af" }}>
                                {meal.label}
                              </span>
                              <span
                                className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                                style={{ background: child.consumed[mk] ? "#00bea3" : "#e5e7eb" }}
                              >
                                {child.consumed[mk] && <span className="text-white font-bold" style={{ fontSize: 8 }}>✓</span>}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 mb-1">{meal.time}</div>
                            <div className="text-xs text-gray-500">
                              P:{nutrients.protein}g · C:{nutrients.carbs}g · F:{nutrients.fat}g
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Nutrient gap breakdown */}
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(NUTRIENT_META).map(([key, meta]) => {
                        const got = consumed[key];
                        const goal = goals[key];
                        const pctN = goal > 0 ? Math.min(100, Math.round((got / goal) * 100)) : 0;
                        const gap = goal - got;
                        const isLow = pctN < 50;

                        return (
                          <div
                            key={key}
                            className="bg-white rounded-xl p-3"
                            style={{ border: `1px solid ${isLow ? "#fecdd3" : "#f3f4f6"}` }}
                          >
                            <div className="flex items-center gap-1 mb-1.5">
                              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: meta.color }} />
                              <span className="text-xs font-bold text-gray-500 flex-1">{meta.label}</span>
                              {isLow && (
                                <span className="font-bold bg-red-100 text-red-500 px-1 py-0.5 rounded" style={{ fontSize: 9 }}>LOW</span>
                              )}
                            </div>
                            <div className="h-1 rounded-full overflow-hidden mb-1.5" style={{ background: meta.trackColor }}>
                              <div className="h-full rounded-full" style={{ width: `${pctN}%`, background: isLow ? "#ef4444" : meta.color }} />
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs font-extrabold" style={{ color: isLow ? "#ef4444" : "#1f2937" }}>
                                {got}g<span className="font-normal text-gray-400">/{goal}g</span>
                              </span>
                              <span className="text-xs font-bold" style={{ color: gap > 0 ? "#ff6d34" : "#00bea3" }}>
                                {gap > 0 ? `${gap}g short` : "✓ Met"}
                              </span>
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