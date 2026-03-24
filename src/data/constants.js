// ─── Nutrient display config ──────────────────────────────────────────────────
// Simplified: use brand green for "good" nutrients, orange for energy ones,
// and gray tracks instead of colorful ones — keeps it clean and on-brand
export const NUTRIENT_META = {
  protein: { label: "Protein", color: "#ff6d34", trackColor: "#f3f4f6" },
  carbs:   { label: "Carbs",   color: "#2D3436", trackColor: "#f3f4f6" },
  fat:     { label: "Fat",     color: "#00bea3", trackColor: "#f3f4f6" },
  fiber:   { label: "Fiber",   color: "#ff6d34", trackColor: "#f3f4f6" },
};

// ─── Meal keys + display meta ─────────────────────────────────────────────────
// Simplified: breakfast = orange (morning energy), lunch = green (main meal),
// snacks = dark slate. All use light gray backgrounds instead of colored ones.
export const MEAL_KEYS = ["breakfast", "lunch", "snacks"];
export const MEAL_META = {
  breakfast: { label: "Breakfast", time: "08:30 AM", color: "#ff6d34", bg: "#fff3ee", border: "#ffd4bc" },
  lunch:     { label: "Lunch",     time: "12:30 PM", color: "#00bea3", bg: "#e6f9f6", border: "#9ee6dc" },
  snacks:    { label: "Snacks",    time: "04:00 PM", color: "#2D3436", bg: "#f3f4f6", border: "#d1d5db" },
};

// ─── Medical badge styles ─────────────────────────────────────────────────────
// Only 3 colors: red = critical, orange = moderate/warning, gray-yellow = mild
export const SEVERITY_STYLE = {
  mild:     { bg: "#fff3ee", color: "#ff6d34", border: "#ffd4bc" },
  moderate: { bg: "#fff3ee", color: "#ff6d34", border: "#ffd4bc" },
  critical: { bg: "#fee2e2", color: "#ef4444", border: "#fca5a5" },
};

// Status colors: red = active problem, orange = watching, green = resolved
export const STATUS_STYLE = {
  Active:     { bg: "#fee2e2", color: "#ef4444", border: "#fca5a5" },
  Monitoring: { bg: "#fff3ee", color: "#ff6d34", border: "#ffd4bc" },
  Resolved:   { bg: "#e6f9f6", color: "#00bea3", border: "#9ee6dc" },
};

export const TYPE_ICON = {
  fever: "🌡️", allergy: "🤧", cold: "🤒", injury: "🩹", other: "🏥",
};

export const STATUS_OPTIONS   = ["Active", "Monitoring", "Resolved"];
export const SEVERITY_OPTIONS = ["mild", "moderate", "critical"];
export const TYPE_OPTIONS     = ["fever", "allergy", "cold", "injury", "other"];