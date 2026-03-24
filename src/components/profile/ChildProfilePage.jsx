import { MEAL_KEYS, MEAL_META, NUTRIENT_META } from "../../data/constants.js";
import { foodNutrients } from "../../data/foodLibrary.js";
import { getChildNutrition, hasHealthAlerts } from "../../data/helpers.js";
import MedicalUpdates, { AddMedicalModal } from "../medical/MedicalUpdates.jsx";
import { useState } from "react";

// Individual profile page for a single child.
// Shows: profile header, nutrition tracking, health vitals, medical updates.
// Opened when teacher clicks a child's name anywhere in the dashboard.
export default function ChildProfilePage({ child, mealPlans, medicalUpdates, setMedicalUpdates, onBack, childrenState }) {
  const { goals, consumed, pct, multiplier } = getChildNutrition(child, mealPlans);
  const isBelow = pct < 50;
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="px-8 pb-12">

      {/* Profile header */}
      <div className="flex items-center gap-4 bg-white rounded-2xl p-6 mb-5 shadow-sm">
        {/* Avatar — brand green */}
        <div className="w-16 h-16 rounded-full bg-[#00bea3] text-white flex items-center justify-center font-extrabold text-2xl flex-shrink-0">
          {child.name[0]}
        </div>

        <div className="flex-1">
          <div className="text-2xl font-extrabold text-gray-800">{child.name}</div>
          <div className="text-sm text-gray-500 mt-0.5">{child.age} · {child.classroom} · {child.teacher}</div>

          {/* Status badges */}
          <div className="flex gap-2 mt-2 flex-wrap">
            {hasHealthAlerts(child)
              ? <span className="text-xs font-bold bg-red-100 text-red-500 px-3 py-1 rounded-lg border border-red-200">⚠ Health alert</span>
              : <span className="text-xs font-bold bg-[#e6f9f6] text-[#00bea3] px-3 py-1 rounded-lg border border-[#9ee6dc]">✓ Healthy</span>
            }
            <span
              className="text-xs font-bold px-3 py-1 rounded-lg border"
              style={{
                background: isBelow ? "#fee2e2" : "#e6f9f6",
                color: isBelow ? "#ef4444" : "#00bea3",
                borderColor: isBelow ? "#fecaca" : "#9ee6dc"
              }}
            >
              {pct}% nutrition goal
            </span>
            <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-3 py-1 rounded-lg border border-gray-200">
              {MEAL_KEYS.filter((k) => child.consumed[k]).length}/3 meals today
            </span>
          </div>
        </div>

        <button
          onClick={onBack}
          className="bg-gray-100 border-none rounded-full px-4 py-2 text-sm font-semibold text-gray-500 cursor-pointer"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="flex flex-col gap-5">

        {/* Nutrition Tracking section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍽️</span>
              <div>
                <div className="text-xs font-bold text-gray-400 tracking-widest">TODAY'S MEALS</div>
                <div className="text-lg font-bold text-gray-800">Nutrition Tracking</div>
              </div>
            </div>
            <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
              Mar 25, 2026
            </span>
          </div>

          {/* Age portion info */}
          <div className="flex gap-2 mb-4">
            <span className="text-xs bg-[#fff3ee] text-[#ff6d34] px-3 py-1 rounded-lg font-semibold">
              {child.age} → {Math.round(multiplier * 100)}% portion of {child.classroom} meal plan
            </span>
            <span className="text-xs text-gray-400 self-center">Age-based goals applied (WHO guidelines)</span>
          </div>

          {/* Meal cards */}
          <div className="flex gap-3 mb-4">
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
                    <span className="text-sm font-bold" style={{ color: child.consumed[mk] ? meal.color : "#9ca3af" }}>
                      {meal.label}
                    </span>
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ background: child.consumed[mk] ? "#00bea3" : "#e5e7eb" }}
                    >
                      {child.consumed[mk] && <span className="text-white font-bold" style={{ fontSize: 9 }}>✓</span>}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1.5">{meal.time}</div>
                  <div className="text-xs text-gray-500">
                    P:{nutrients.protein}g · C:{nutrients.carbs}g · F:{nutrients.fat}g · Fi:{nutrients.fiber}g
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily nutrient progress */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-bold text-gray-800">Daily Nutrient Progress</span>
              <span className="text-sm font-extrabold" style={{ color: isBelow ? "#ef4444" : "#00bea3" }}>
                {pct}% of daily goal
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
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
                        <span className="font-bold bg-red-100 text-red-500 px-1 rounded" style={{ fontSize: 9 }}>LOW</span>
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
        </div>

        {/* Health Status section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💚</span>
              <div>
                <div className="text-xs font-bold text-gray-400 tracking-widest">VITALS &amp; WELLNESS</div>
                <div className="text-lg font-bold text-gray-800">Health Status</div>
              </div>
            </div>
            <button className="bg-gray-100 border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-600 cursor-pointer">
              Realtime check
            </button>
          </div>

          {/* Vital cards grid */}
          <div className="grid grid-cols-3 gap-2.5">
            {Object.entries(child.health).map(([key, vital]) => (
              <div
                key={key}
                className="rounded-xl p-4"
                style={{
                  background: vital.ok ? "#fafafa" : "#fff5f5",
                  border: `1px solid ${vital.ok ? "#f3f4f6" : "#fecdd3"}`
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{vital.icon}</span>
                  <span className="text-xs font-bold text-gray-400 tracking-wide">{vital.label.toUpperCase()}</span>
                </div>
                <div className="text-lg font-extrabold mb-2" style={{ color: vital.ok ? "#1f2937" : "#ef4444" }}>
                  {vital.value}
                </div>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full inline-block"
                  style={{
                    background: vital.ok ? "#e6f9f6" : "#fee2e2",
                    color: vital.ok ? "#00bea3" : "#ef4444",
                    border: `1px solid ${vital.ok ? "#9ee6dc" : "#fecaca"}`
                  }}
                >
                  {vital.ok ? "Good" : "Needs Attention"}
                </span>
                {!vital.ok && vital.alert && (
                  <div className="text-xs text-[#ff6d34] mt-1.5">⚠ {vital.alert}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Medical updates for this child only */}
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
          onAdd={(entry) => setMedicalUpdates((prev) => [entry, ...prev])}
          childrenState={childrenState}
        />
      )}
    </div>
  );
}