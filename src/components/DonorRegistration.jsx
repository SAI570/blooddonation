import { useState } from "react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const CITIES = ["Chennai", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Other"];

export default function DonorRegistration({ onRegister }) {
  const [form, setForm] = useState({
    name: "", bloodGroup: "", location: "", phone: "", lastDonated: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (!form.bloodGroup) e.bloodGroup = "Please select a blood group.";
    if (!form.location) e.location = "Please select a city.";
    if (!/^[6-9]\d{9}$/.test(form.phone)) e.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!form.lastDonated) e.lastDonated = "Please enter the last donation date.";
    else {
      const d = new Date(form.lastDonated);
      const today = new Date();
      if (d > today) e.lastDonated = "Date cannot be in the future.";
    }
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
    onRegister(form);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm({ name: "", bloodGroup: "", location: "", phone: "", lastDonated: "" }); }, 2000);
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h2>🩸 Become a Donor</h2>
        <p>Join our life-saving community. Your blood can save up to 3 lives.</p>
      </div>

      {submitted ? (
        <div className="success-msg">
          <div className="success-icon">✅</div>
          <h3>Registration Successful!</h3>
          <p>Thank you for joining BloodLink. You're a hero!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label>Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Arjun Mehta" />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="field-row">
            <div className="field">
              <label>Blood Group *</label>
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                <option value="">Select</option>
                {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
              {errors.bloodGroup && <span className="error">{errors.bloodGroup}</span>}
            </div>

            <div className="field">
              <label>City *</label>
              <select name="location" value={form.location} onChange={handleChange}>
                <option value="">Select</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.location && <span className="error">{errors.location}</span>}
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label>Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile" maxLength={10} />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="field">
              <label>Last Donation Date *</label>
              <input name="lastDonated" type="date" value={form.lastDonated} onChange={handleChange} max={new Date().toISOString().split("T")[0]} />
              {errors.lastDonated && <span className="error">{errors.lastDonated}</span>}
            </div>
          </div>

          <button type="submit" className="submit-btn">Register as Donor 🩸</button>
        </form>
      )}
    </div>
  );
}
