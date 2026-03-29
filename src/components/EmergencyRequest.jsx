import { useState } from "react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const URGENCY = ["Critical (< 2 hours)", "Urgent (< 12 hours)", "Moderate (< 24 hours)"];

export default function EmergencyRequest({ donors, onNotify }) {
  const [form, setForm] = useState({ patientName: "", bloodGroup: "", hospital: "", city: "", urgency: "", contact: "", units: 1, reason: "" });
  const [errors, setErrors] = useState({});
  const [matches, setMatches] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.patientName.trim()) e.patientName = "Patient name is required.";
    if (!form.bloodGroup) e.bloodGroup = "Blood group is required.";
    if (!form.hospital.trim()) e.hospital = "Hospital name is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.urgency) e.urgency = "Urgency level is required.";
    if (!/^[6-9]\d{9}$/.test(form.contact)) e.contact = "Enter a valid 10-digit number.";
    if (!form.reason.trim() || form.reason.trim().length < 10) e.reason = "Please provide a brief reason (min 10 chars).";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const found = donors.filter(
      (d) => d.bloodGroup === form.bloodGroup && d.available &&
        d.location.toLowerCase().includes(form.city.toLowerCase())
    );
    setMatches(found);
    setSubmitted(true);
    onNotify(found.length > 0
      ? `🚨 Emergency sent! ${found.length} matching donor(s) found in ${form.city}.`
      : `🚨 Request logged. No exact matches found — try nearby cities.`,
      found.length > 0 ? "success" : "warning"
    );
  };

  if (submitted) {
    return (
      <div className="form-card">
        <div className="emergency-result">
          <h2>🚨 Emergency Request Submitted</h2>
          <div className={`result-banner ${matches.length > 0 ? "result-ok" : "result-warn"}`}>
            {matches.length > 0
              ? `✅ ${matches.length} available donor(s) found for ${form.bloodGroup} in ${form.city}!`
              : `⚠️ No available ${form.bloodGroup} donors found in ${form.city}. Please contact nearby hospitals.`}
          </div>

          {matches.length > 0 && (
            <div className="match-list">
              <h3>Matching Donors:</h3>
              {matches.map((d) => (
                <div key={d.id} className="match-item">
                  <span className="match-name">{d.name}</span>
                  <span className="match-bg">{d.bloodGroup}</span>
                  <span>📍 {d.location}</span>
                  <a href={`tel:${d.phone}`} className="call-btn">📞 Call</a>
                </div>
              ))}
            </div>
          )}

          <div className="emergency-tip">
            <strong>⚡ Emergency Contacts:</strong>
            <p>Ambulance: 108 &nbsp;|&nbsp; Blood Bank: 104 &nbsp;|&nbsp; Police: 100</p>
          </div>

          <button className="submit-btn" onClick={() => { setSubmitted(false); setForm({ patientName: "", bloodGroup: "", hospital: "", city: "", urgency: "", contact: "", units: 1, reason: "" }); setMatches(null); }}>
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-card emergency-form">
      <div className="form-header emergency-header">
        <h2>🚨 Emergency Blood Request</h2>
        <p>Fill this form carefully. We'll match available donors immediately.</p>
        <div className="hotline">📞 Emergency Hotline: <strong>108</strong></div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-row">
          <div className="field">
            <label>Patient Name *</label>
            <input name="patientName" value={form.patientName} onChange={handleChange} placeholder="Full name" />
            {errors.patientName && <span className="error">{errors.patientName}</span>}
          </div>
          <div className="field">
            <label>Blood Group Required *</label>
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
              <option value="">Select</option>
              {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            {errors.bloodGroup && <span className="error">{errors.bloodGroup}</span>}
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Hospital Name *</label>
            <input name="hospital" value={form.hospital} onChange={handleChange} placeholder="Hospital / Clinic name" />
            {errors.hospital && <span className="error">{errors.hospital}</span>}
          </div>
          <div className="field">
            <label>City *</label>
            <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Chennai" />
            {errors.city && <span className="error">{errors.city}</span>}
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Urgency Level *</label>
            <select name="urgency" value={form.urgency} onChange={handleChange}>
              <option value="">Select</option>
              {URGENCY.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            {errors.urgency && <span className="error">{errors.urgency}</span>}
          </div>
          <div className="field">
            <label>Units Needed</label>
            <input name="units" type="number" min={1} max={10} value={form.units} onChange={handleChange} />
          </div>
        </div>

        <div className="field">
          <label>Contact Number *</label>
          <input name="contact" value={form.contact} onChange={handleChange} placeholder="10-digit mobile" maxLength={10} />
          {errors.contact && <span className="error">{errors.contact}</span>}
        </div>

        <div className="field">
          <label>Reason / Medical Condition *</label>
          <textarea name="reason" value={form.reason} onChange={handleChange} placeholder="Brief description of the emergency..." rows={3} />
          {errors.reason && <span className="error">{errors.reason}</span>}
        </div>

        <button type="submit" className="submit-btn emergency-btn">🚨 Send Emergency Request</button>
      </form>
    </div>
  );
}
