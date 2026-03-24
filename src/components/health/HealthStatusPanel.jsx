import { useState } from "react";
import { hasHealthAlerts } from "../../data/helpers.js";

// One collapsible section per classroom.
// Click the classroom header to expand and see children.
// Click a child name → goes to their profile page.
// Click the ▼ arrow on a child row → shows editable vitals inline.
export function ClassroomGroup({ classroom, children, setSelectedChild, onUpdateHealth }) {
  const alertCount = children.filter(hasHealthAlerts).length;
  const [isOpen, setIsOpen] = useState(false);
  const [expandedChild, setExpandedChild] = useState(null);

  return (
    <div className={`rounded-xl border overflow-hidden mb-3 ${alertCount > 0 ? "border-red-200" : "border-gray-200"}`}>

      {/* Classroom header — click to expand/collapse */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer ${alertCount > 0 ? "bg-red-50" : "bg-gray-50"}`}
        style={{ borderBottom: isOpen ? "1px solid #e5e7eb" : "none" }}
      >
        <div className="flex-1">
          <div className="text-sm font-bold text-gray-800">{classroom}</div>
          <div className="text-xs text-gray-400">{children.length} students</div>
        </div>

        {/* Alert and good counts */}
        <div className="flex gap-2">
          {alertCount > 0 && (
            <span className="text-xs font-bold bg-red-100 text-red-500 px-3 py-1 rounded-full border border-red-200">
              ⚠ {alertCount} alert{alertCount > 1 ? "s" : ""}
            </span>
          )}
          <span className="text-xs font-bold bg-[#e6f9f6] text-[#00bea3] px-3 py-1 rounded-full border border-[#9ee6dc]">
            ✓ {children.length - alertCount} good
          </span>
        </div>

        {/* Rotate arrow when open */}
        <span
          className="text-xs text-gray-400 inline-block transition-transform"
          style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
        >▼</span>
      </div>

      {/* Children list — shown when classroom is expanded */}
      {isOpen && (
        <div className="p-3 flex flex-col gap-2">
          {children.map((child) => {
            const isVitalsOpen = expandedChild === child.id;
            const hasAlerts = hasHealthAlerts(child);

            return (
              <div key={child.id}>
                {/* Child row */}
                <div
                  className="flex items-center gap-3 px-3 py-2 rounded-xl"
                  style={{
                    background: isVitalsOpen ? "#e6f9f6" : "#fff",
                    border: `1.5px solid ${isVitalsOpen ? "#00bea3" : hasAlerts ? "#fecdd3" : "#f3f4f6"}`
                  }}
                >
                  {/* Child name — click to go to profile */}
                  <div
                    onClick={() => setSelectedChild(child.id)}
                    className="flex items-center gap-2 flex-1 cursor-pointer"
                  >
                    {/* All avatars use brand green */}
                    <div className="w-7 h-7 rounded-full bg-[#00bea3] text-white flex items-center justify-center font-bold flex-shrink-0" style={{ fontSize: 11 }}>
                      {child.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#00bea3] underline decoration-dotted">
                        {child.name}
                      </div>
                      <div className="text-xs text-gray-400">{child.age}</div>
                    </div>
                  </div>

                  {/* Vital status dots: green = ok, red = alert */}
                  <div className="flex gap-1">
                    {Object.entries(child.health).map(([key, vital]) => (
                      <span
                        key={key}
                        title={`${vital.label}: ${vital.value}`}
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ background: vital.ok ? "#00bea3" : "#ef4444" }}
                      />
                    ))}
                  </div>

                  {/* Status badge */}
                  {hasAlerts
                    ? <span className="text-xs font-bold bg-red-100 text-red-500 px-2 py-0.5 rounded-lg border border-red-200">⚠ Attention</span>
                    : <span className="text-xs font-bold bg-[#e6f9f6] text-[#00bea3] px-2 py-0.5 rounded-lg border border-[#9ee6dc]">✓ Good</span>
                  }

                  {/* Arrow to expand/collapse vitals */}
                  <span
                    onClick={() => setExpandedChild(isVitalsOpen ? null : child.id)}
                    className="text-xs text-gray-400 cursor-pointer px-1 inline-block transition-transform"
                    style={{ transform: isVitalsOpen ? "rotate(180deg)" : "none" }}
                  >▼</span>
                </div>

                {/* Editable vitals — shown when child row is expanded */}
                {isVitalsOpen && (
                  <div className="grid grid-cols-3 gap-1.5 mt-1.5 px-1 pb-1.5">
                    {Object.entries(child.health).map(([key, vital]) => (
                      <div
                        key={key}
                        className="bg-white rounded-xl p-3"
                        style={{ border: `1px solid ${vital.ok ? "#f3f4f6" : "#fecdd3"}` }}
                      >
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-sm">{vital.icon}</span>
                          <span className="text-gray-400 font-bold flex-1 tracking-wide" style={{ fontSize: 9 }}>
                            {vital.label.toUpperCase()}
                          </span>
                        </div>

                        {/* Teacher types in the new value */}
                        <input
                          value={vital.value}
                          onChange={(e) => onUpdateHealth(child.id, key, "value", e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full text-sm font-bold border border-gray-200 rounded-lg px-2 py-1 outline-none mb-1.5 box-border"
                          style={{ color: vital.ok ? "#1f2937" : "#ef4444" }}
                        />

                        {/* Toggle between Good and Attention */}
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs text-gray-400">Status:</span>
                          <button
                            onClick={() => onUpdateHealth(child.id, key, "ok", !vital.ok)}
                            className="text-xs font-bold px-2 py-0.5 rounded-lg border-none cursor-pointer"
                            style={{
                              background: vital.ok ? "#e6f9f6" : "#fee2e2",
                              color: vital.ok ? "#00bea3" : "#ef4444"
                            }}
                          >
                            {vital.ok ? "✓ Good" : "⚠ Attention"}
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

// Main component — groups all children by classroom
export default function HealthStatusPanel({ childrenState, selectedChild, setSelectedChild, onUpdateHealth }) {
  const classrooms = [...new Set(childrenState.map((c) => c.classroom))];
  const totalAlerts = childrenState.filter(hasHealthAlerts).length;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💚</span>
          <div>
            <div className="text-xs font-bold text-gray-400 tracking-widest">VITALS &amp; WELLNESS</div>
            <div className="text-lg font-bold text-gray-800">Health Status</div>
          </div>
        </div>

        <div className="flex gap-2">
          {totalAlerts > 0 && (
            <span className="text-xs font-bold bg-red-100 text-red-500 px-3 py-1 rounded-full border border-red-200">
              ⚠ {totalAlerts} alert{totalAlerts > 1 ? "s" : ""}
            </span>
          )}
          <button className="bg-gray-100 border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-600 cursor-pointer">
            Realtime check
          </button>
        </div>
      </div>

      {/* One collapsible group per classroom */}
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