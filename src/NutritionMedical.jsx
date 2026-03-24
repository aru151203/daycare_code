import { useState } from "react";
import { INIT_CHILDREN, INIT_MEDICAL, INIT_MEAL_PLANS } from "./data/childrenData.js";
import Header from "./components/Header.jsx";
import ChildSearch from "./components/ChildSearch.jsx";
import NotificationCard from "./components/NotificationCard.jsx";
import MealPlanLogger from "./components/nutrition/MealPlanLogger.jsx";
import NutritionSummaryTable from "./components/nutrition/NutritionSummaryTable.jsx";
import HealthStatusPanel from "./components/health/HealthStatusPanel.jsx";
import MedicalUpdates, { AddMedicalModal } from "./components/medical/MedicalUpdates.jsx";
import ChildProfilePage from "./components/profile/ChildProfilePage.jsx";

// Tab names for the top navigation bar
const TABS = ["Overview", "Daily Activities", "Payments", "Messages", "Events", "Nutrition & Health"];

// Format today's date as a readable string like "25 Mar 2026"
function getTodayString() {
  return new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function NutritionMedical() {

  // ── App state ──────────────────────────────────────────────────────────────
  const [childrenState, setChildrenState] = useState(
    [...INIT_CHILDREN].sort((a, b) => a.name.localeCompare(b.name)) // sorted alphabetically
  );
  const [mealPlans, setMealPlans]         = useState(INIT_MEAL_PLANS);
  const [medicalUpdates, setMedicalUpdates] = useState(INIT_MEDICAL);
  const [selectedChild, setSelectedChild] = useState(null);    // which child profile is open
  const [showModal, setShowModal]         = useState(false);   // add medical modal
  const [activeTab, setActiveTab]         = useState("Nutrition & Health");
  const [selectedDate, setSelectedDate]   = useState(getTodayString());

  // ── Handlers ───────────────────────────────────────────────────────────────

  // Update food items for a specific meal in a classroom
  function updateMealPlan(room, mealKey, foods) {
    setMealPlans((prev) => ({
      ...prev,
      [room]: { ...prev[room], [mealKey]: { foods } }
    }));
  }

  // Toggle whether a single child ate a specific meal
  function toggleMeal(childId, mealKey) {
    setChildrenState((prev) =>
      prev.map((child) =>
        child.id !== childId ? child : {
          ...child,
          consumed: { ...child.consumed, [mealKey]: !child.consumed[mealKey] }
        }
      )
    );
  }

  // Mark all children's meal as eaten (true) or not eaten (false) at once
  function bulkMeal(mealKey, value) {
    setChildrenState((prev) =>
      prev.map((child) => ({
        ...child,
        consumed: { ...child.consumed, [mealKey]: value }
      }))
    );
  }

  // Update a health vital value or status for a specific child
  function updateHealth(childId, vitalKey, field, value) {
    setChildrenState((prev) =>
      prev.map((child) =>
        child.id !== childId ? child : {
          ...child,
          health: {
            ...child.health,
            [vitalKey]: { ...child.health[vitalKey], [field]: value }
          }
        }
      )
    );
  }

  // Find the full child object for whoever is selected
  const activeChild = selectedChild
    ? childrenState.find((c) => c.id === selectedChild)
    : null;

  // ── Child Profile View ─────────────────────────────────────────────────────
  // If a child is selected, show their full profile instead of the main dashboard
  if (activeChild) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <ChildProfilePage
          child={activeChild}
          mealPlans={mealPlans}
          medicalUpdates={medicalUpdates}
          setMedicalUpdates={setMedicalUpdates}
          childrenState={childrenState}
          onBack={() => setSelectedChild(null)}
        />
      </div>
    );
  }

  // ── Main Dashboard View ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <Header />

      {/* Child search bar */}
      <ChildSearch
        childrenState={childrenState}
        mealPlans={mealPlans}
        onSelectChild={setSelectedChild}
      />

      {/* Navigation tabs */}
      <nav className="flex bg-gray-200 rounded-xl mx-8 my-4 p-1 gap-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium cursor-pointer border-none whitespace-nowrap transition-colors
              ${activeTab === tab
                ? "bg-white text-gray-800 shadow-sm"
                : "bg-transparent text-gray-500"
              }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Page heading */}
      <div className="flex items-start justify-between px-8 pb-5">
        <h2 className="text-2xl font-extrabold text-gray-800">Nutrition &amp; Health Dashboard</h2>
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm font-semibold text-gray-800 cursor-pointer whitespace-nowrap">
          <span
            className="w-2 h-2 rounded-full bg-[#00bea3] inline-block"
            style={{ boxShadow: "0 0 0 3px rgba(0,190,163,0.2)" }}
          />
          Live Classroom
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-col gap-5 px-8">

        {/* Alert notifications */}
        <NotificationCard
          childrenState={childrenState}
          mealPlans={mealPlans}
          onSelectChild={setSelectedChild}
        />

        {/* Nutrition tracking card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">🍽️</span>
            <div>
              <div className="text-xs font-bold text-gray-400 tracking-widest">TODAY'S MEALS</div>
              <div className="text-lg font-bold text-gray-800">Nutrition Tracking</div>
            </div>
          </div>

          {/* Meal plan editor */}
          <MealPlanLogger
            mealPlans={mealPlans}
            onUpdate={updateMealPlan}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />

          {/* Per-child meal tracking table */}
          <NutritionSummaryTable
            childrenState={childrenState}
            mealPlans={mealPlans}
            onToggleMeal={toggleMeal}
            onBulkMeal={bulkMeal}
          />
        </div>

        {/* Health vitals */}
        <HealthStatusPanel
          childrenState={childrenState}
          selectedChild={selectedChild}
          setSelectedChild={setSelectedChild}
          onUpdateHealth={updateHealth}
        />

        {/* Medical updates log */}
        <MedicalUpdates
          medicalUpdates={medicalUpdates}
          setMedicalUpdates={setMedicalUpdates}
          childrenState={childrenState}
          onAddClick={() => setShowModal(true)}
        />
      </div>

      {/* Add medical update modal */}
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