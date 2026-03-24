import { useState } from "react";
import { MEAL_KEYS, MEAL_META, NUTRIENT_META } from "../../data/constants.js";
import { FOOD_LIBRARY, foodNutrients } from "../../data/foodLibrary.js";

// Shows 3 meal columns (Breakfast, Lunch, Snacks) for the selected classroom.
// Teacher clicks Edit to add or remove food items for each meal.
// All children in a classroom share the same meal plan.
// Portions are scaled per child by age — see helpers.js.
export default function MealPlanLogger({ mealPlans, onUpdate, selectedDate, onDateChange }) {
  const classrooms = Object.keys(mealPlans);
  const [activeRoom, setActiveRoom] = useState(classrooms[0]);
  const [editingMeal, setEditingMeal] = useState(null);
  const [foodSearch, setFoodSearch] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  // Calendar tracks which month we are viewing
  const [calendarDate, setCalendarDate] = useState(new Date());

  const plan = mealPlans[activeRoom];
  const filteredFoods = FOOD_LIBRARY.filter((f) =>
    f.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  // Add or remove a food from the current meal being edited
  function toggleFood(foodId) {
    const currentFoods = plan[editingMeal].foods;
    const updatedFoods = currentFoods.includes(foodId)
      ? currentFoods.filter((id) => id !== foodId)
      : [...currentFoods, foodId];
    onUpdate(activeRoom, editingMeal, updatedFoods);
  }

  // Calendar helpers
  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayStr = new Date().toDateString();
  const selectedDateStr = new Date(selectedDate).toDateString();

  function handleDayClick(day) {
    const clicked = new Date(year, month, day);
    onDateChange(clicked.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }));
    setShowCalendar(false);
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-5">

      {/* Title + calendar button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">📋</span>
          <span className="text-sm font-bold text-gray-800">Classroom Meal Plans</span>
        </div>

        {/* Calendar date picker */}
        <div className="relative">
          <button
            onClick={() => setShowCalendar((s) => !s)}
            className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-3 py-1 cursor-pointer"
          >
            📅 {selectedDate}
          </button>

          {/* Calendar popup */}
          {showCalendar && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-50 w-64">

              {/* Month navigation */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
                  className="text-gray-400 bg-transparent border-none cursor-pointer text-base px-1"
                >‹</button>
                <span className="text-sm font-bold text-gray-800">{MONTH_NAMES[month]} {year}</span>
                <button
                  onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
                  className="text-gray-400 bg-transparent border-none cursor-pointer text-base px-1"
                >›</button>
              </div>

              {/* Day name headers */}
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {DAY_NAMES.map((d) => (
                  <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
                ))}
              </div>

              {/* Day number grid */}
              <div className="grid grid-cols-7 gap-0.5">
                {/* Empty cells before the 1st of the month */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Actual day numbers */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const thisDate = new Date(year, month, day);
                  const isToday = thisDate.toDateString() === todayStr;
                  const isSelected = thisDate.toDateString() === selectedDateStr && !isToday;

                  return (
                    <div
                      key={day}
                      onClick={() => handleDayClick(day)}
                      className={`text-center text-xs py-1 rounded cursor-pointer
                        ${isToday    ? "bg-[#ff6d34] text-white font-bold" : ""}
                        ${isSelected ? "bg-[#00bea3] text-white font-bold" : ""}
                        ${!isToday && !isSelected ? "text-gray-700 hover:bg-gray-100" : ""}
                      `}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>

              <div className="text-xs text-gray-400 mt-2 text-center">
                🟠 Today &nbsp; 🟢 Selected
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Classroom tabs */}
      <div className="flex gap-2 mb-4">
        {classrooms.map((room) => (
          <button
            key={room}
            onClick={() => { setActiveRoom(room); setEditingMeal(null); }}
            className={`text-xs font-bold px-4 py-1.5 rounded-full border-none cursor-pointer
              ${activeRoom === room ? "bg-gray-800 text-white" : "bg-white text-gray-500"}`}
          >
            {room}
          </button>
        ))}
      </div>

      {/* 3 meal columns */}
      <div className="flex gap-3">
        {MEAL_KEYS.map((mk) => {
          const meal = MEAL_META[mk];
          const foods = plan[mk].foods;
          const isEditing = editingMeal === mk;
          const nutrients = foodNutrients(foods, 1);

          return (
            <div
              key={mk}
              className="flex-1 rounded-xl p-3"
              style={{ background: meal.bg, borderTop: `3px solid ${meal.color}` }}
            >
              {/* Meal header */}
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs text-gray-400">{meal.time}</div>
                  <div className="text-sm font-bold" style={{ color: meal.color }}>{meal.label}</div>
                </div>
                <button
                  onClick={() => { setEditingMeal(isEditing ? null : mk); setFoodSearch(""); }}
                  className="text-xs font-bold bg-white rounded-xl px-2 py-0.5 cursor-pointer"
                  style={{ color: meal.color, border: `1px solid ${meal.border}` }}
                >
                  {isEditing ? "Done" : "✏ Edit"}
                </button>
              </div>

              {/* Food tags */}
              <div className="flex flex-wrap gap-1 mb-2 min-h-5">
                {foods.length === 0
                  ? <span className="text-xs text-gray-400">No items added</span>
                  : foods.map((id) => {
                      const food = FOOD_LIBRARY.find((x) => x.id === id);
                      return food
                        ? <span key={id} className="text-xs bg-black/10 text-gray-600 px-2 py-0.5 rounded-lg">{food.name}</span>
                        : null;
                    })
                }
              </div>

              {/* Nutrient totals for this meal */}
              <div className="flex gap-1">
                {Object.entries(NUTRIENT_META).map(([k, meta]) => (
                  <div key={k} className="flex-1 text-center bg-white/70 rounded py-0.5">
                    <div className="text-gray-400" style={{ fontSize: 9 }}>{meta.label.slice(0, 3)}</div>
                    <div className="text-xs font-bold" style={{ color: meta.color }}>{nutrients[k]}g</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Age portion legend */}
      <div className="flex gap-2 mt-3 flex-wrap">
        {[
          "Age 1–3 yrs → 60% portion",
          "Age 4–5 yrs → 80% portion",
          "Age 6+ yrs  → 100% portion",
        ].map((label) => (
          <span key={label} className="text-xs text-gray-600 font-semibold px-3 py-1 rounded-lg bg-gray-100">
            {label}
          </span>
        ))}
        <span className="text-xs text-gray-400 self-center ml-1">Nutrient goals also scale by age</span>
      </div>

      {/* Food picker — shown when editing a meal */}
      {editingMeal && (
        <div className="mt-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <input
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              placeholder="🔍 Search food..."
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none"
            />
          </div>
          <div className="p-3 grid grid-cols-4 gap-1.5 max-h-44 overflow-y-auto">
            {filteredFoods.map((food) => {
              const isSelected = plan[editingMeal].foods.includes(food.id);
              return (
                <div
                  key={food.id}
                  onClick={() => toggleFood(food.id)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer border text-xs
                    ${isSelected ? "bg-[#e6f9f6] border-[#9ee6dc]" : "bg-gray-50 border-gray-100"}`}
                >
                  {/* Checkbox */}
                  <div
                    className="w-3 h-3 rounded flex items-center justify-center flex-shrink-0 border-2"
                    style={{
                      background: isSelected ? "#00bea3" : "#fff",
                      borderColor: isSelected ? "#00bea3" : "#d1d5db"
                    }}
                  >
                    {isSelected && <span className="text-white font-bold" style={{ fontSize: 8 }}>✓</span>}
                  </div>
                  <span className="text-gray-800 truncate">{food.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}