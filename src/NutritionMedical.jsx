import { useState } from "react";
import { INIT_CHILDREN, INIT_MEDICAL, INIT_MEAL_PLANS } from "./data/childrenData.js";
import Header from "./components/Header.jsx";
import ChildSearch from "./components/ChildSearch.jsx";
import NotificationCard from "./components/NotificationCard.jsx";import MealPlanLogger                           from "./components/nutrition/MealPlanLogger.jsx";
import NutritionSummaryTable                    from "./components/nutrition/NutritionSummaryTable.jsx";
import HealthStatusPanel                        from "./components/health/HealthStatusPanel.jsx";
import MedicalUpdates, { AddMedicalModal }      from "./components/medical/MedicalUpdates.jsx";
import ChildProfilePage                         from "./components/profile/ChildProfilePage.jsx";

const TABS = ["Overview", "Daily Activities", "Payments", "Messages", "Events", "Nutrition & Health"];

export default function NutritionMedical() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [childrenState,  setChildrenState]  = useState([...INIT_CHILDREN].sort((a, b) => a.name.localeCompare(b.name)));
  const [mealPlans,      setMealPlans]      = useState(INIT_MEAL_PLANS);
  const [medicalUpdates, setMedicalUpdates] = useState(INIT_MEDICAL);
  const [selectedChild,  setSelectedChild]  = useState(null);
  const [showModal,      setShowModal]      = useState(false);
  const [activeTab,      setActiveTab]      = useState("Nutrition & Health");

  // ── Handlers ───────────────────────────────────────────────────────────────
  const updateMealPlan = (room, mealKey, foods) =>
    setMealPlans((prev) => ({ ...prev, [room]: { ...prev[room], [mealKey]: { foods } } }));

  const toggleMeal = (childId, mealKey) =>
    setChildrenState((prev) => prev.map((c) =>
      c.id !== childId ? c : { ...c, consumed: { ...c.consumed, [mealKey]: !c.consumed[mealKey] } }
    ));

  const bulkMeal = (mealKey, value) =>
    setChildrenState((prev) => prev.map((c) => ({ ...c, consumed: { ...c.consumed, [mealKey]: value } })));

  const updateHealth = (childId, vitalKey, field, val) =>
    setChildrenState((prev) => prev.map((c) =>
      c.id !== childId ? c : { ...c, health: { ...c.health, [vitalKey]: { ...c.health[vitalKey], [field]: val } } }
    ));

  const activeChild = selectedChild ? childrenState.find((c) => c.id === selectedChild) : null;

  // ── Child Profile View ─────────────────────────────────────────────────────
  if (activeChild) {
    return (
      <div style={{ minHeight: "100vh", background: "#FDF5F0", fontFamily: "'Inter', sans-serif" }}>
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
    <div style={{ minHeight: "100vh", background: "#FDF5F0", fontFamily: "'Inter', sans-serif", paddingBottom: 48 }}>
      <Header />

      <ChildSearch
       childrenState={childrenState}
       mealPlans={mealPlans}
       onSelectChild={setSelectedChild}
      /> 

      {/* Nav tabs */}
      <nav style={{ display: "flex", background: "#F1EBE6", borderRadius: 14, margin: "18px 32px", padding: 5, gap: 4 }}>
        {TABS.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ flex: 1, padding: "9px 10px", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
              background: activeTab === tab ? "#fff"    : "none",
              color:      activeTab === tab ? "#2D3436" : "#64748B",
              boxShadow:  activeTab === tab ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
            {tab}
          </button>
        ))}
      </nav>

      {/* Page title */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "0 32px 18px" }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#2D3436", margin: 0 }}>Nutrition &amp; Health Dashboard</h2>
          <p style={{ fontSize: 13, color: "#94A3B8", margin: "4px 0 0" }}>
            
          </p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 7, background: "#fff", border: "1.5px solid #E2D9D1", borderRadius: 20, padding: "7px 16px", fontSize: 13, fontWeight: 600, color: "#2D3436", cursor: "pointer", whiteSpace: "nowrap" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E", display: "inline-block", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
          Live Classroom
        </button>
      </div>

      {/* Main content panels */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "0 32px" }}>

        <NotificationCard
          childrenState={childrenState}
          mealPlans={mealPlans}
          onSelectChild={setSelectedChild}
        />

        {/* Nutrition Tracking */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "22px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>🍽️</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em" }}>TODAY'S MEALS</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#2D3436" }}>Nutrition Tracking</div>
              </div>
            </div>
            <span style={{ fontSize: 12, color: "#94A3B8", background: "#F8FAFC", padding: "4px 10px", borderRadius: 20, border: "1px solid #E2E8F0" }}>Mar 25, 2026</span>
          </div>
          <MealPlanLogger mealPlans={mealPlans} onUpdate={updateMealPlan} />
          <NutritionSummaryTable childrenState={childrenState} mealPlans={mealPlans} onToggleMeal={toggleMeal} onBulkMeal={bulkMeal} />
        </div>

        <HealthStatusPanel
          childrenState={childrenState}
          selectedChild={selectedChild}
          setSelectedChild={setSelectedChild}
          onUpdateHealth={updateHealth}
        />

        <MedicalUpdates
          medicalUpdates={medicalUpdates}
          setMedicalUpdates={setMedicalUpdates}
          childrenState={childrenState}
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
