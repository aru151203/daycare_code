import { MEAL_KEYS } from "./constants.js";
import { foodNutrients } from "./foodLibrary.js";

// ─── Age-based daily nutrition goals (WHO guidelines) ─────────────────────────
// Also returns a portion multiplier: 3yr eats 60%, 4-5yr 80%, 6+ 100% of meal
export function getAgeGoals(ageStr) {
  const y = parseInt(ageStr);
  if (y <= 3) return { protein: 13, carbs: 130, fat: 35, fiber: 19, multiplier: 0.60 };
  if (y <= 5) return { protein: 19, carbs: 130, fat: 30, fiber: 22, multiplier: 0.80 };
  return             { protein: 20, carbs: 135, fat: 28, fiber: 25, multiplier: 1.00 };
}

// Returns consumed nutrients, goals, overall %, and portion multiplier for a child
export function getChildNutrition(child, mealPlans) {
  const { multiplier, ...goals } = getAgeGoals(child.age);
  const plan     = mealPlans[child.classroom] || {};
  const consumed = { protein: 0, carbs: 0, fat: 0, fiber: 0 };
  MEAL_KEYS.forEach((mk) => {
    if (child.consumed[mk] && plan[mk]) {
      const n = foodNutrients(plan[mk].foods, multiplier);
      Object.keys(consumed).forEach((k) => { consumed[k] += n[k]; });
    }
  });
  const totalConsumed = Object.values(consumed).reduce((a, b) => a + b, 0);
  const totalGoal     = Object.values(goals).reduce((a, b) => a + b, 0);
  const pct           = totalGoal > 0 ? Math.round((totalConsumed / totalGoal) * 100) : 0;
  return { goals, consumed, pct, multiplier };
}

// Returns true if any vital is flagged as not ok
export function hasHealthAlerts(child) {
  return Object.values(child.health).some((v) => !v.ok);
}

// Returns array of alert flags for notification card
// Triggers: health symptoms, 2+ skipped meals, <50% nutrition
export function getChildFlags(child, mealPlans) {
  const flags = [];

  const sick = Object.values(child.health).filter((v) => !v.ok);
  if (sick.length) flags.push({
    type: "health", icon: "🏥",
    label: `${sick.length} health alert${sick.length > 1 ? "s" : ""}`,
    severity: "critical",
  });

  const skipped = MEAL_KEYS.filter((k) => !child.consumed[k]);
  if (skipped.length >= 2) flags.push({
    type: "meal", icon: "🍽️",
    label: `Skipped ${skipped.join(" & ")}`,
    severity: "warning",
  });

  const { pct } = getChildNutrition(child, mealPlans);
  if (pct < 50) flags.push({
    type: "nutrition", icon: "📊",
    label: `Only ${pct}% nutrition consumed`,
    severity: "warning",
  });

  return flags;
}