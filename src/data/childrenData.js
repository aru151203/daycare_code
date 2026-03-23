// ─── Per-classroom meal plans ─────────────────────────────────────────────────
// Teacher logs food items once per classroom — all children in that room share the same plan.
// Portion sizes are then scaled per child based on age (see helpers.js).
export const INIT_MEAL_PLANS = {
  "Rainbow Room": {
    breakfast: { foods: ["poha", "banana", "milk"] },
    lunch:     { foods: ["khichdi", "chapati", "cucumber"] },
    snacks:    { foods: ["idli", "makhana", "apple"] },
  },
  "Sunshine Room": {
    breakfast: { foods: ["upma", "milk", "banana"] },
    lunch:     { foods: ["rice", "dal", "sabzi", "curd"] },
    snacks:    { foods: ["orange", "makhana"] },
  },
  "Star Room": {
    breakfast: { foods: ["sandwich", "milk"] },
    lunch:     { foods: ["roti", "dal", "sabzi", "curd"] },
    snacks:    { foods: ["apple", "idli"] },
  },
};

// ─── Children ─────────────────────────────────────────────────────────────────
// Each child has: id, name, age, classroom, teacher, consumed (per meal),
// and health vitals (temperature, energy, mood, hydration).
// consumed.breakfast/lunch/snacks = boolean (teacher ticks when child eats)
// health[vital].ok = boolean, health[vital].value = string the teacher can edit
export const INIT_CHILDREN = [
  { id: "aarohi",    name: "Aarohi",    age: "3 yrs", avatarBg: "#4DD0C4", classroom: "Rainbow Room",  teacher: "Ms. Sarah",
    consumed: { breakfast: true,  lunch: true,  snacks: false },
    health: {
      temperature: { label: "Temperature", icon: "🌡️", value: "98.4 F", ok: true  },
      heartRate:   { label: "Heart Rate",  icon: "💓", value: "96 bpm", ok: true },
      energy:      { label: "Energy",      icon: "⚡", value: "Playful", ok: true  },
      mood:        { label: "Mood",        icon: "😊", value: "Bright", ok: true  },
      hydration:   { label: "Hydration",   icon: "💧", value: "Needs Attention", ok: false, alert: "Not drinking enough water" },
    },
  },
  { id: "khushi",    name: "Khushi",    age: "4 yrs", avatarBg: "#F48FB1", classroom: "Sunshine Room", teacher: "Mr. Rahul",
    consumed: { breakfast: true,  lunch: false, snacks: false },
    health: {
      temperature: { label: "Temperature", icon: "🌡️", value: "100.2 F", ok: false, alert: "Mild fever"   },
      heartRate:   { label: "Heart Rate",  icon: "💓", value: "96 bpm",  ok: false, alert: "Elevated heart rate" },
      energy:      { label: "Energy",      icon: "⚡", value: "Low",      ok: false, alert: "Lethargic"    },
      mood:        { label: "Mood",        icon: "😊", value: "Cranky",   ok: false, alert: "Irritable"    },
      hydration:   { label: "Hydration",   icon: "💧", value: "Good",     ok: true  },
    },
  },
  { id: "karan",     name: "Karan",     age: "5 yrs", avatarBg: "#60A5FA", classroom: "Star Room",     teacher: "Ms. Priya",
    consumed: { breakfast: true,  lunch: true,  snacks: true  },
    health: {
      temperature: { label: "Temperature", icon: "🌡️", value: "98.7 F", ok: true },
      heartRate:   { label: "Heart Rate",  icon: "💓", value: "96 bpm", ok: true },
      energy:      { label: "Energy",      icon: "⚡", value: "Active",  ok: true },
      mood:        { label: "Mood",        icon: "😊", value: "Happy",   ok: true },
      hydration:   { label: "Hydration",   icon: "💧", value: "Good",    ok: true },
    },
  },

  { id: "arjun",     name: "Arjun",     age: "3 yrs", avatarBg: "#A78BFA", classroom: "Star Room",     teacher: "Ms. Priya",
    consumed: { breakfast: true,  lunch: false, snacks: false },
    health: {
      temperature: { label: "Temperature", icon: "🌡️", value: "99.1 F", ok: false, alert: "Elevated temp" },
      heartRate:   { label: "Heart Rate",  icon: "💓", value: "96 bpm", ok: false, alert: "Elevated heart rate" },
      energy:      { label: "Energy",      icon: "⚡", value: "Tired",   ok: false, alert: "Skipped nap"   },
      mood:        { label: "Mood",        icon: "😊", value: "Quiet",   ok: true  },
      hydration:   { label: "Hydration",   icon: "💧", value: "Good",    ok: true  },
    },
  },
  
  { id: "saanvi",    name: "Saanvi",    age: "4 yrs", avatarBg: "#F9A8D4", classroom: "Rainbow Room",  teacher: "Ms. Sarah",
    consumed: { breakfast: true,  lunch: true,  snacks: false },
    health: {
      temperature: { label: "Temperature", icon: "🌡️", value: "98.6 F", ok: true },
      heartRate:   { label: "Heart Rate",  icon: "💓", value: "96 bpm", ok: true },
      energy:      { label: "Energy",      icon: "⚡", value: "Playful", ok: true },
      mood:        { label: "Mood",        icon: "😊", value: "Happy",   ok: true },
      hydration:   { label: "Hydration",   icon: "💧", value: "Good",    ok: true },
    },
  },
  { id: "rudransh",  name: "Rudransh",  age: "3 yrs", avatarBg: "#FCD34D", classroom: "Sunshine Room", teacher: "Mr. Rahul",
    consumed: { breakfast: false, lunch: false, snacks: true  },
    health: {
      temperature: { label: "Temperature", icon: "🌡️", value: "98.3 F",   ok: true },
      heartRate:   { label: "Heart Rate",  icon: "💓", value: "96 bpm", ok: true },
      energy:      { label: "Energy",      icon: "⚡", value: "Active",    ok: true },
      mood:        { label: "Mood",        icon: "😊", value: "Cheerful",  ok: true },
      hydration:   { label: "Hydration",   icon: "💧", value: "Good",      ok: true },
    },
  },

];

// ─── Medical updates ──────────────────────────────────────────────────────────
// childId links to INIT_CHILDREN for profile filtering
// severity: mild | moderate | critical
// status:   Active | Monitoring | Resolved  (teacher updates this as child improves)
export const INIT_MEDICAL = [
  { id: 1, childId: "khushi",   child: "Khushi",   date: "Mar 25, 2026", note: "Mild fever, temp 100.2°F",                  medicine: "Paracetamol (2.5 ml)", teacher: "Mr. Rahul", type: "fever",  severity: "critical",  status: "Active"     },
  { id: 2, childId: "aarohi",   child: "Aarohi",   date: "Mar 25, 2026", note: "Dehydration signs, refusing water",         medicine: "ORS solution",         teacher: "Ms. Sarah", type: "other",  severity: "moderate",  status: "Monitoring" },
  { id: 3, childId: "arjun",    child: "Arjun",    date: "Mar 25, 2026", note: "Slightly elevated temp after outdoor play", medicine: "Rest + fluids",        teacher: "Ms. Priya", type: "fever",  severity: "mild",      status: "Monitoring" },
  { id: 4, childId: "rudransh", child: "Rudransh", date: "Mar 25, 2026", note: "Skipped breakfast and lunch today",         medicine: "Monitor appetite",     teacher: "Mr. Rahul", type: "other",  severity: "mild",      status: "Active"     },
];