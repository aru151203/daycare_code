import { useState } from "react";
import { getChildFlags } from "../data/helpers.js";

// Scans all children and shows alerts for:
//   - health problems (any vital flagged as not ok)
//   - 2 or more skipped meals
//   - nutrition below 50% of daily goal
// Teacher can dismiss individual alerts with the X button
export default function NotificationCard({ childrenState, mealPlans, onSelectChild }) {
  const [dismissed, setDismissed] = useState([]);

  // Find all children who have alerts and haven't been dismissed yet
  const flaggedChildren = childrenState
    .map((child) => ({ child, flags: getChildFlags(child, mealPlans) }))
    .filter(({ child, flags }) => flags.length > 0 && !dismissed.includes(child.id));

  const criticalCount = flaggedChildren.filter(({ flags }) =>
    flags.some((f) => f.severity === "critical")
  ).length;

  const warningCount = flaggedChildren.length - criticalCount;

  // Show a green all-clear message if no alerts
  if (flaggedChildren.length === 0) {
    return (
      <div className="flex items-center gap-3 bg-[#e6f9f6] border-2 border-[#9ee6dc] rounded-2xl px-5 py-3">
        <span className="text-lg">✅</span>
        <span className="text-sm font-semibold text-[#00bea3]">
          All Clear — All children are healthy and meals are on track.
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-red-200 rounded-2xl overflow-hidden shadow-sm">

      {/* Card header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-red-100 bg-red-50">
        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-base">
          🔔
        </div>

        <div className="flex-1">
          <span className="text-sm font-bold text-gray-800">Attention Required</span>
          <span className="text-xs text-gray-400 ml-2">
            {flaggedChildren.length} student{flaggedChildren.length > 1 ? "s" : ""} flagged today
          </span>
        </div>

        {/* Summary badges */}
        <div className="flex gap-2">
          {criticalCount > 0 && (
            <span className="text-xs font-bold bg-red-100 text-red-500 px-3 py-1 rounded-full border border-red-200">
              🏥 {criticalCount} critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="text-xs font-bold bg-[#fff3ee] text-[#ff6d34] px-3 py-1 rounded-full border border-[#ffd4bc]">
              ⚠ {warningCount} warning{warningCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* One row per flagged child */}
      <div className="px-5 py-3">
        {flaggedChildren.map(({ child, flags }) => {
          const isCritical = flags.some((f) => f.severity === "critical");

          return (
            <div key={child.id} className="flex items-center gap-3 py-2 border-b border-red-50 last:border-0">

              {/* Red dot for critical, orange for warning */}
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: isCritical ? "#ef4444" : "#ff6d34" }}
              />

              {/* Child name — clicking goes to their profile */}
              <div
                className="flex items-center gap-2 min-w-28 cursor-pointer"
                onClick={() => onSelectChild(child.id)}
              >
                <div className="w-6 h-6 rounded-full bg-[#00bea3] text-white flex items-center justify-center font-bold flex-shrink-0" style={{ fontSize: 10 }}>
                  {child.name[0]}
                </div>
                <span className="text-sm font-bold text-[#00bea3] underline decoration-dotted">
                  {child.name.split(" ")[0]}
                </span>
              </div>

              {/* List of flags for this child */}
              <span className="text-xs text-gray-600 flex-1">
                {flags.map((flag, i) => (
                  <span key={i}>
                    <span
                      className="font-semibold"
                      style={{ color: flag.severity === "critical" ? "#ef4444" : "#ff6d34" }}
                    >
                      {flag.icon} {flag.label}
                    </span>
                    {i < flags.length - 1 && <span className="text-gray-300"> · </span>}
                  </span>
                ))}
              </span>

              {/* Dismiss button */}
              <button
                onClick={() => setDismissed((prev) => [...prev, child.id])}
                className="text-gray-300 bg-transparent border-none cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>
          );
        })}

        <div className="text-xs text-gray-300 mt-2 text-right">
          Thresholds: 2+ skipped meals · &lt;50% daily nutrition · health alerts
        </div>
      </div>
    </div>
  );
}