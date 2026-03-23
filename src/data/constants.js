// ─── Nutrient display config ──────────────────────────────────────────────────
export const NUTRIENT_META = {
  protein: { label: "Protein", color: "#8B5CF6", trackColor: "#EDE9FE" },
  carbs:   { label: "Carbs",   color: "#F97316", trackColor: "#FFF7ED" },
  fat:     { label: "Fat",     color: "#EC4899", trackColor: "#FDF2F8" },
  fiber:   { label: "Fiber",   color: "#10B981", trackColor: "#ECFDF5" },
};

// ─── Meal keys + display meta ─────────────────────────────────────────────────
export const MEAL_KEYS = ["breakfast", "lunch", "snacks"];
export const MEAL_META = {
  breakfast: { label: "Breakfast", time: "08:30 AM", color: "#F97316", bg: "#FFF7ED", border: "#FED7AA" },
  lunch:     { label: "Lunch",     time: "12:30 PM", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
  snacks:    { label: "Snacks",    time: "04:00 PM", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
};

// ─── Medical tag styles ───────────────────────────────────────────────────────
export const SEVERITY_STYLE = {
  mild:     { bg: "#FEF9C3", color: "#A16207", border: "#FDE68A" },
  moderate: { bg: "#FEF3C7", color: "#B45309", border: "#FCD34D" },
  critical: { bg: "#FEE2E2", color: "#DC2626", border: "#FCA5A5" },
};
export const STATUS_STYLE = {
  Active:     { bg: "#FEE2E2", color: "#DC2626", border: "#FCA5A5" },
  Monitoring: { bg: "#FEF3C7", color: "#B45309", border: "#FCD34D" },
  Resolved:   { bg: "#DCFCE7", color: "#15803D", border: "#BBF7D0" },
};
export const TYPE_ICON = {
  fever: "🌡️", allergy: "🤧", cold: "🤒", injury: "🩹", other: "🏥",
};
export const STATUS_OPTIONS   = ["Active", "Monitoring", "Resolved"];
export const SEVERITY_OPTIONS = ["mild", "moderate", "critical"];
export const TYPE_OPTIONS     = ["fever", "allergy", "cold", "injury", "other"];