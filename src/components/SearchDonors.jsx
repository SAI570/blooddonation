import { useState } from "react";

const BLOOD_GROUPS = ["", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export default function SearchDonors({ onSearch }) {
  const [filters, setFilters] = useState({ bloodGroup: "", location: "", availableOnly: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updated = { ...filters, [name]: type === "checkbox" ? checked : value };
    setFilters(updated);
    onSearch(updated);
  };

  const handleReset = () => {
    const reset = { bloodGroup: "", location: "", availableOnly: false };
    setFilters(reset);
    onSearch(reset);
  };

  return (
    <div className="search-card">
      <h2>🔍 Find a Donor</h2>
      <div className="search-row">
        <div className="field">
          <label>Blood Group</label>
          <select name="bloodGroup" value={filters.bloodGroup} onChange={handleChange}>
            {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g || "All Groups"}</option>)}
          </select>
        </div>

        <div className="field">
          <label>City / Location</label>
          <input
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="e.g. Chennai"
          />
        </div>

        <div className="field field-check">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="availableOnly"
              checked={filters.availableOnly}
              onChange={handleChange}
            />
            Available Only
          </label>
        </div>

        <button className="reset-btn" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}
