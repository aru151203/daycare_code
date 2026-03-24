import { useState, useRef, useEffect } from "react";
import { MEAL_KEYS } from "../data/constants.js";
import { getChildFlags } from "../data/helpers.js";

export default function ChildSearch({ childrenState, mealPlans, onSelectChild }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [showDropdown, setShowDropdown] = useState(false);

  // Used to detect clicks outside the search box so we can close the dropdown
  const wrapperRef = useRef(null);

  // Get list of unique classroom names for the filter buttons
  const classrooms = ["All", ...new Set(childrenState.map((c) => c.classroom))];

  // Close dropdown when user clicks anywhere outside the search box
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter children by typed name and selected classroom
  const filteredChildren = childrenState.filter((child) => {
    const nameMatches = child.name.toLowerCase().includes(query.toLowerCase());
    const roomMatches = filter === "All" || child.classroom === filter;
    return nameMatches && roomMatches;
  });

  const shouldShowDropdown = showDropdown && filteredChildren.length > 0;

  function handleSelect(childId) {
    onSelectChild(childId);
    setQuery("");
    setShowDropdown(false);
  }

  return (
    <div className="px-8 pt-5">

      {/* Classroom filter buttons */}
      <div className="flex gap-2 mb-3">
        {classrooms.map((room) => (
          <button
            key={room}
            onClick={() => setFilter(room)}
            className={`text-xs font-semibold px-3 py-1 rounded-full border-none cursor-pointer transition-colors
              ${filter === room
                ? "bg-gray-800 text-white shadow-sm"
                : "bg-white text-gray-500 shadow-sm"
              }`}
          >
            {room === "All" ? "All Rooms" : room.replace(" Room", "")}
          </button>
        ))}
      </div>

      {/* Search input + dropdown */}
      <div ref={wrapperRef} className="relative max-w-sm">

        {/* Search box */}
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-200">
          <span className="text-gray-400 text-base">🔍</span>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search child by name..."
            className="flex-1 border-none outline-none text-sm text-gray-800 bg-transparent"
          />
          {/* Only show the X button when there is text to clear */}
          {query && (
            <button
              onClick={() => { setQuery(""); setShowDropdown(false); }}
              className="text-gray-400 bg-transparent border-none cursor-pointer text-sm"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdown results list */}
        {shouldShowDropdown && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden max-h-80 overflow-y-auto">

            {/* Result count header */}
            <div className="px-3 py-2 border-b border-gray-100 text-xs text-gray-400 font-semibold">
              {filteredChildren.length} student{filteredChildren.length !== 1 ? "s" : ""} found
            </div>

            {filteredChildren.map((child) => {
              const flags = getChildFlags(child, mealPlans);
              const mealsEaten = MEAL_KEYS.filter((k) => child.consumed[k]).length;
              const hasAlert = flags.length > 0;

              return (
                <div
                  key={child.id}
                  onClick={() => handleSelect(child.id)}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar — brand green with alert dot if needed */}
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#00bea3] text-white flex items-center justify-center font-bold text-sm">
                      {child.name[0]}
                    </div>
                    {hasAlert && (
                      <span
                        className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold"
                        style={{ fontSize: 7 }}
                      >
                        {flags.length}
                      </span>
                    )}
                  </div>

                  {/* Child name and classroom */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-800">{child.name}</div>
                    <div className="text-xs text-gray-400">{child.age} · {child.classroom}</div>
                  </div>

                  {/* Meal dots: green = eaten, gray = skipped */}
                  <div className="flex items-center gap-1">
                    {MEAL_KEYS.map((mk) => (
                      <span
                        key={mk}
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ background: child.consumed[mk] ? "#00bea3" : "#e0e0e0" }}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">{mealsEaten}/3</span>
                  </div>

                  {/* Alert or Good badge */}
                  {hasAlert
                    ? <span className="text-xs font-bold bg-red-100 text-red-500 px-2 py-0.5 rounded-lg border border-red-200">⚠ Alert</span>
                    : <span className="text-xs font-bold bg-[#e6f9f6] text-[#00bea3] px-2 py-0.5 rounded-lg border border-[#9ee6dc]">✓ Good</span>
                  }

                  <span className="text-xs text-gray-300">→</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}