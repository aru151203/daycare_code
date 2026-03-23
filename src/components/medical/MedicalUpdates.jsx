import { useState } from "react";
import {
  SEVERITY_STYLE, STATUS_STYLE, TYPE_ICON,
  STATUS_OPTIONS, SEVERITY_OPTIONS, TYPE_OPTIONS,
} from "../../data/constants.js";

// ─── AddMedicalModal ──────────────────────────────────────────────────────────
// Modal form for teacher to log a new medical incident.
// Child dropdown auto-fills the name. Supports external children too.
export function AddMedicalModal({ onClose, onAdd, childrenState }) {
  const [form, setForm] = useState({
    childId: "", child: "", note: "", medicine: "",
    teacher: "", type: "fever", severity: "mild", status: "Active",
  });

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    if (e.target.name === "childId" && e.target.value) {
      const found = childrenState.find((c) => c.id === e.target.value);
      if (found) updated.child = found.name;
    }
    setForm(updated);
  };

  const handleSubmit = () => {
    if (!form.child || !form.note) return;
    onAdd({
      ...form,
      id: Date.now(),
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    });
    onClose();
  };

  const inputStyle = {
    padding: "10px 14px", borderRadius: 10, border: "1.5px solid #E2E8F0",
    fontSize: 13, color: "#2D3436", outline: "none",
    fontFamily: "inherit", background: "#fff", width: "100%",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "28px 28px 24px", width: 460, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", maxHeight: "90vh", overflowY: "auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#2D3436" }}>Add Medical Update</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#94A3B8" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Child selector */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B" }}>Child</label>
            <select name="childId" value={form.childId} onChange={handleChange} style={inputStyle}>
              <option value="">-- Select a child --</option>
              {childrenState.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.classroom})</option>
              ))}
              <option value="other">Other / External</option>
            </select>
            {(!form.childId || form.childId === "other") && (
              <input name="child" value={form.child} onChange={handleChange}
                placeholder="Enter child name" style={{ ...inputStyle, marginTop: 6 }} />
            )}
          </div>

          {/* Text fields */}
          {[
            { label: "Note",               name: "note",     placeholder: "e.g. Mild fever after lunch"  },
            { label: "Medicine/Treatment", name: "medicine", placeholder: "e.g. Paracetamol 2.5ml"       },
            { label: "Logged by",          name: "teacher",  placeholder: "e.g. Ms. Priya"               },
          ].map((f) => (
            <div key={f.name} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B" }}>{f.label}</label>
              <input name={f.name} value={form[f.name]} onChange={handleChange}
                placeholder={f.placeholder} style={inputStyle} />
            </div>
          ))}

          {/* Type / Severity / Status dropdowns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            {[
              { label: "Type",     name: "type",     options: TYPE_OPTIONS.map((t)     => ({ value: t, label: `${TYPE_ICON[t]} ${t.charAt(0).toUpperCase() + t.slice(1)}` })) },
              { label: "Severity", name: "severity", options: SEVERITY_OPTIONS.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })) },
              { label: "Status",   name: "status",   options: STATUS_OPTIONS.map((s)   => ({ value: s, label: s })) },
            ].map((f) => (
              <div key={f.name} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B" }}>{f.label}</label>
                <select name={f.name} value={form[f.name]} onChange={handleChange} style={inputStyle}>
                  {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 22 }}>
          <button onClick={onClose} style={{ background: "#F1F5F9", border: "none", borderRadius: 22, padding: "9px 20px", fontSize: 13, fontWeight: 600, color: "#64748B", cursor: "pointer" }}>Cancel</button>
          <button onClick={handleSubmit} style={{ background: "#ff6d34", border: "none", borderRadius: 22, padding: "9px 24px", fontSize: 13, fontWeight: 700, color: "#fff", cursor: "pointer" }}>Add Update</button>
        </div>
      </div>
    </div>
  );
}

// ─── MedicalUpdateCard ────────────────────────────────────────────────────────
// Single medical incident entry. Shows type, severity, status, note, treatment.
// "Update Status" cycles Active → Monitoring → Resolved in one click.
function MedicalUpdateCard({ update, linkedChild, onUpdateStatus, onDelete }) {
  const ss = SEVERITY_STYLE[update.severity] || SEVERITY_STYLE.mild;
  const ts = STATUS_STYLE[update.status]     || STATUS_STYLE.Active;

  return (
    <div style={{ padding: "14px 16px", background: "#fff", borderRadius: 14, border: `1.5px solid ${ss.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: ss.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 17 }}>
          {TYPE_ICON[update.type] || "🏥"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {linkedChild && (
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: linkedChild.avatarBg, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 10 }}>
                {linkedChild.name[0]}
              </div>
            )}
            <span style={{ fontWeight: 700, fontSize: 14, color: "#2D3436" }}>{update.child}</span>
            <span style={{ fontSize: 11, color: "#94A3B8" }}>{update.date}</span>
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>Logged by <strong>{update.teacher}</strong></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 10, background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
            {update.severity.charAt(0).toUpperCase() + update.severity.slice(1)}
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 10, background: ts.bg, color: ts.color, border: `1px solid ${ts.border}` }}>
            {update.status}
          </span>
        </div>
      </div>

      <div style={{ fontSize: 13, color: "#475569", marginBottom: 6, paddingLeft: 46 }}>{update.note}</div>
      {update.medicine && (
        <div style={{ fontSize: 12, color: "#64748B", paddingLeft: 46 }}>
          <strong>Treatment:</strong> {update.medicine}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, paddingLeft: 46 }}>
        <span style={{ fontSize: 11, background: "#F1F5F9", color: "#475569", padding: "2px 10px", borderRadius: 10, border: "1px solid #E2E8F0", fontWeight: 600 }}>
          {TYPE_ICON[update.type]} {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
        </span>
        <div style={{ flex: 1 }} />
        <button onClick={onUpdateStatus}
          style={{ fontSize: 11, fontWeight: 600, background: "none", border: "1.5px solid #CBD5E1", color: "#475569", padding: "3px 10px", borderRadius: 16, cursor: "pointer" }}>
          Update Status
        </button>
        <button onClick={onDelete}
          style={{ fontSize: 11, fontWeight: 600, background: "#FEE2E2", border: "none", borderRadius: 16, padding: "3px 10px", color: "#DC2626", cursor: "pointer" }}>
          Delete
        </button>
      </div>
    </div>
  );
}

// ─── MedicalUpdates ───────────────────────────────────────────────────────────
// Full Medical Updates section — shows all updates (or filtered by child).
// Used in both main dashboard and child profile page.
export default function MedicalUpdates({ medicalUpdates, setMedicalUpdates, childrenState, filterChildId, onAddClick }) {
  const visible = filterChildId
    ? medicalUpdates.filter((u) => u.childId === filterChildId)
    : medicalUpdates;

  const cycleStatus = (id) => {
    setMedicalUpdates((prev) => prev.map((u) =>
      u.id !== id ? u : { ...u, status: STATUS_OPTIONS[(STATUS_OPTIONS.indexOf(u.status) + 1) % STATUS_OPTIONS.length] }
    ));
  };

  const deleteUpdate = (id) => {
    setMedicalUpdates((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: "22px 24px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>🩺</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em" }}>LOGGED TODAY</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#2D3436" }}>Medical Updates</div>
          </div>
        </div>
        <button onClick={onAddClick}
          style={{ background: "#ff6d34", color: "#fff", border: "none", borderRadius: 22, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          + Add Update
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {visible.length === 0 && (
          <div style={{ textAlign: "center", color: "#94A3B8", padding: "24px 0", fontSize: 13 }}>
            No medical updates logged today.
          </div>
        )}
        {visible.map((u) => (
          <MedicalUpdateCard
            key={u.id}
            update={u}
            linkedChild={childrenState.find((c) => c.id === u.childId)}
            onUpdateStatus={() => cycleStatus(u.id)}
            onDelete={() => deleteUpdate(u.id)}
          />
        ))}
      </div>
    </div>
  );
}
