import { useState } from "react";
import DonorRegistration from "./components/DonorRegistration";
import SearchDonors from "./components/SearchDonors";
import EmergencyRequest from "./components/EmergencyRequest";
import DonorCard from "./components/DonorCard";
import "./App.css";

const INITIAL_DONORS = [
  { id: 1, name: "Arjun Mehta", bloodGroup: "A+", location: "Chennai", phone: "9876543210", available: true, lastDonated: "2024-10-01" },
  { id: 2, name: "Priya Sharma", bloodGroup: "O-", location: "Mumbai", phone: "9123456789", available: true, lastDonated: "2024-08-15" },
  { id: 3, name: "Rahul Nair", bloodGroup: "B+", location: "Delhi", phone: "9988776655", available: false, lastDonated: "2025-01-20" },
  { id: 4, name: "Sneha Iyer", bloodGroup: "AB+", location: "Chennai", phone: "9001122334", available: true, lastDonated: "2024-12-05" },
  { id: 5, name: "Vikram Das", bloodGroup: "O+", location: "Bangalore", phone: "9445566778", available: true, lastDonated: "2025-02-10" },
  { id: 6, name: "Divya Rao", bloodGroup: "A-", location: "Hyderabad", phone: "9334455667", available: false, lastDonated: "2025-03-01" },
];

export default function App() {
  const [donors, setDonors] = useState(INITIAL_DONORS);
  const [activeTab, setActiveTab] = useState("search");
  const [notification, setNotification] = useState(null);
  const [filteredDonors, setFilteredDonors] = useState(null);

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const registerDonor = (donor) => {
    const newDonor = { ...donor, id: Date.now(), available: true };
    setDonors((prev) => [newDonor, ...prev]);
    showNotification("🎉 Donor registered successfully!");
    setActiveTab("search");
  };

  const toggleAvailability = (id) => {
    setDonors((prev) =>
      prev.map((d) => (d.id === id ? { ...d, available: !d.available } : d))
    );
  };

  const handleSearch = (filters) => {
    let result = donors;
    if (filters.bloodGroup) result = result.filter((d) => d.bloodGroup === filters.bloodGroup);
    if (filters.location) result = result.filter((d) => d.location.toLowerCase().includes(filters.location.toLowerCase()));
    if (filters.availableOnly) result = result.filter((d) => d.available);
    setFilteredDonors(result);
  };

  const displayedDonors = filteredDonors !== null ? filteredDonors : donors;

  return (
    <div className="app">
      {/* Hero */}
      <header className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="logo-pill">🩸 BloodLink</div>
          <h1>Every Drop<br /><span>Saves a Life</span></h1>
          <p>Connect blood donors with those in urgent need. Fast, reliable, life-saving.</p>
          <div className="hero-stats">
            <div className="stat"><span>{donors.length}</span>Donors</div>
            <div className="stat"><span>{donors.filter(d => d.available).length}</span>Available</div>
            <div className="stat"><span>8</span>Blood Groups</div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>{notification.msg}</div>
      )}

      {/* Tabs */}
      <nav className="tabs">
        {[
          { key: "search", label: "🔍 Find Donors" },
          { key: "register", label: "➕ Register" },
          { key: "emergency", label: "🚨 Emergency" },
        ].map((t) => (
          <button
            key={t.key}
            className={`tab-btn ${activeTab === t.key ? "active" : ""}`}
            onClick={() => { setActiveTab(t.key); setFilteredDonors(null); }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="main">
        {activeTab === "search" && (
          <div className="section">
            <SearchDonors onSearch={handleSearch} />
            <div className="donors-header">
              <h2>
                {filteredDonors !== null
                  ? `${filteredDonors.length} result${filteredDonors.length !== 1 ? "s" : ""} found`
                  : "All Donors"}
              </h2>
              {filteredDonors !== null && (
                <button className="clear-btn" onClick={() => setFilteredDonors(null)}>Clear Filters</button>
              )}
            </div>
            {displayedDonors.length === 0 ? (
              <div className="empty">😔 No donors found. Try different filters.</div>
            ) : (
              <div className="donor-grid">
                {displayedDonors.map((donor) => (
                  <DonorCard key={donor.id} donor={donor} onToggle={toggleAvailability} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "register" && (
          <div className="section">
            <DonorRegistration onRegister={registerDonor} />
          </div>
        )}

        {activeTab === "emergency" && (
          <div className="section">
            <EmergencyRequest donors={donors} onNotify={showNotification} />
          </div>
        )}
      </main>

      <footer className="footer">
        <p>🩸 BloodLink — Connecting Hearts, Saving Lives</p>
        <p className="footer-sub">In an emergency, call <strong>108</strong> immediately.</p>
      </footer>
    </div>
  );
}
