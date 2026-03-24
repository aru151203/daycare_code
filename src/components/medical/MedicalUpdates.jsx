import { useState } from "react";
import {
  SEVERITY_STYLE, STATUS_STYLE, TYPE_ICON,
  STATUS_OPTIONS, SEVERITY_OPTIONS, TYPE_OPTIONS,
} from "../../data/constants.js";

// Modal form for adding a new medical update
export function AddMedicalModal({ onClose, onAdd, childrenState }) {
  const [form, setForm] = useState({
    childId: "", child: "", note: "", medicine: "",
    teacher: "", type: "fever", severity: "mild", status: "Active",
  });

  // When teacher picks a child from the dropdown, auto-fill their name
  function handleChange(e) {
    const updated = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === "childId" && e.target.value) {
      const found = childrenState.find((c) => c.id === e.target.value);
      if (found) updated.child = found.name;
    }
    setForm(updated);
  }

  function handleSubmit() {
    // Don't submit if required fields are empty
    if (!form.child || !form.note) return;
    onAdd({
      ...form,
      id: Date.now(),
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    });
    onClose();
  }

  const inputStyle = "w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none bg-white";

  return (
    <div className="fixed inset-0 bg-black/35 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-7 w-[460px] shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <span className="text-lg font-extrabold text-gray-800">Add Medical Update</span>
          <button onClick={onClose} className="text-lg text-gray-400 bg-transparent border-none cursor-pointer">✕</button>
        </div>

        <div className="flex flex-col gap-3.5">

          {/* Child selector dropdown */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500">Child</label>
            <select name="childId" value={form.childId} onChange={handleChange} className={inputStyle}>
              <option value="">-- Select a child --</option>
              {childrenState.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.classroom})</option>
              ))}
              <option value="other">Other / External</option>
            </select>
            {/* Show a text input if "Other" is selected */}
            {(!form.childId || form.childId === "other") && (
              <input
                name="child"
                value={form.child}
                onChange={handleChange}
                placeholder="Enter child name"
                className={`${inputStyle} mt-1.5`}
              />
            )}
          </div>

          {/* Note, medicine, teacher fields */}
          {[
            { label: "Note",               name: "note",     placeholder: "e.g. Mild fever after lunch"  },
            { label: "Medicine/Treatment", name: "medicine", placeholder: "e.g. Paracetamol 2.5ml"       },
            { label: "Logged by",          name: "teacher",  placeholder: "e.g. Ms. Priya"               },
          ].map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500">{field.label}</label>
              <input
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className={inputStyle}
              />
            </div>
          ))}

          {/* Type, Severity, Status dropdowns */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: "Type",     name: "type",     options: TYPE_OPTIONS.map((t)     => ({ value: t, label: `${TYPE_ICON[t]} ${t.charAt(0).toUpperCase() + t.slice(1)}` })) },
              { label: "Severity", name: "severity", options: SEVERITY_OPTIONS.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })) },
              { label: "Status",   name: "status",   options: STATUS_OPTIONS.map((s)   => ({ value: s, label: s })) },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-1">
                <label className="text-xs font-bold text-gray-500">{field.label}</label>
                <select name={field.name} value={form[field.name]} onChange={handleChange} className={inputStyle}>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end mt-6">
          <button onClick={onClose} className="bg-gray-100 border-none rounded-full px-5 py-2 text-sm font-semibold text-gray-500 cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-[#ff6d34] border-none rounded-full px-6 py-2 text-sm font-bold text-white cursor-pointer">
            Add Update
          </button>
        </div>
      </div>
    </div>
  );
}

// Single medical record card
function MedicalUpdateCard({ update, linkedChild, onUpdateStatus, onDelete }) {
  // Look up the style for this card's severity and status
  const severityStyle = SEVERITY_STYLE[update.severity] || SEVERITY_STYLE.mild;
  const statusStyle   = STATUS_STYLE[update.status]     || STATUS_STYLE.Active;

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm" style={{ border: `1.5px solid ${severityStyle.border}` }}>

      <div className="flex items-center gap-3 mb-2.5">
        {/* Type icon circle */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
          style={{ background: severityStyle.bg }}
        >
          {TYPE_ICON[update.type] || "🏥"}
        </div>

        {/* Child name + date */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {linkedChild && (
              <div className="w-5 h-5 rounded-full bg-[#00bea3] text-white flex items-center justify-center font-bold" style={{ fontSize: 10 }}>
                {linkedChild.name[0]}
              </div>
            )}
            <span className="font-bold text-sm text-gray-800">{update.child}</span>
            <span className="text-xs text-gray-400">{update.date}</span>
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Logged by <strong>{update.teacher}</strong></div>
        </div>

        {/* Severity + Status badges stacked on the right */}
        <div className="flex flex-col items-end gap-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-lg"
            style={{ background: severityStyle.bg, color: severityStyle.color, border: `1px solid ${severityStyle.border}` }}
          >
            {update.severity.charAt(0).toUpperCase() + update.severity.slice(1)}
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-lg"
            style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}
          >
            {update.status}
          </span>
        </div>
      </div>

      {/* Note text */}
      <div className="text-sm text-gray-600 mb-1.5 pl-12">{update.note}</div>

      {/* Treatment — only shown if filled in */}
      {update.medicine && (
        <div className="text-xs text-gray-400 pl-12">
          <strong>Treatment:</strong> {update.medicine}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-2.5 pl-12">
        <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg border border-gray-200 font-semibold">
          {TYPE_ICON[update.type]} {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
        </span>
        <div className="flex-1" />
        <button onClick={onUpdateStatus} className="text-xs font-semibold bg-white border border-gray-300 text-gray-600 px-3 py-1 rounded-full cursor-pointer">
          Update Status
        </button>
        <button onClick={onDelete} className="text-xs font-semibold bg-red-100 border-none rounded-full px-3 py-1 text-red-500 cursor-pointer">
          Delete
        </button>
      </div>
    </div>
  );
}

// Full Medical Updates section.
// filterChildId is optional — if passed, only shows updates for that one child
export default function MedicalUpdates({ medicalUpdates, setMedicalUpdates, childrenState, filterChildId, onAddClick }) {
  const visible = filterChildId
    ? medicalUpdates.filter((u) => u.childId === filterChildId)
    : medicalUpdates;

  // Cycles status: Active → Monitoring → Resolved → Active
  function cycleStatus(id) {
    setMedicalUpdates((prev) =>
      prev.map((update) => {
        if (update.id !== id) return update;
        const nextIndex = (STATUS_OPTIONS.indexOf(update.status) + 1) % STATUS_OPTIONS.length;
        return { ...update, status: STATUS_OPTIONS[nextIndex] };
      })
    );
  }

  function deleteUpdate(id) {
    setMedicalUpdates((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🩺</span>
          <div>
            <div className="text-xs font-bold text-gray-400 tracking-widest">LOGGED TODAY</div>
            <div className="text-lg font-bold text-gray-800">Medical Updates</div>
          </div>
        </div>
        <button onClick={onAddClick} className="bg-[#ff6d34] text-white border-none rounded-full px-4 py-2 text-sm font-semibold cursor-pointer">
          + Add Update
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {visible.length === 0 && (
          <div className="text-center text-gray-400 py-6 text-sm">
            No medical updates logged today.
          </div>
        )}
        {visible.map((update) => (
          <MedicalUpdateCard
            key={update.id}
            update={update}
            linkedChild={childrenState.find((c) => c.id === update.childId)}
            onUpdateStatus={() => cycleStatus(update.id)}
            onDelete={() => deleteUpdate(update.id)}
          />
        ))}
      </div>
    </div>
  );
}