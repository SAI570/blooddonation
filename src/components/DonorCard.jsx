export default function DonorCard({ donor, onToggle }) {
  const bg = {
    "A+": "#e53935", "A-": "#c62828", "B+": "#1e88e5", "B-": "#1565c0",
    "O+": "#43a047", "O-": "#2e7d32", "AB+": "#8e24aa", "AB-": "#6a1b9a",
  };
  const color = bg[donor.bloodGroup] || "#333";

  return (
    <div className={`donor-card ${donor.available ? "available" : "unavailable"}`}>
      <div className="blood-badge" style={{ background: color }}>
        {donor.bloodGroup}
      </div>
      <div className="card-body">
        <h3>{donor.name}</h3>
        <p className="card-location">📍 {donor.location}</p>
        <p className="card-phone">📞 {donor.phone}</p>
        <p className="card-donated">🗓 Last donated: {donor.lastDonated}</p>
        <div className="card-footer">
          <span className={`status-badge ${donor.available ? "status-available" : "status-busy"}`}>
            {donor.available ? "✅ Available" : "⏸ Unavailable"}
          </span>
          <button
            className="toggle-btn"
            onClick={() => onToggle(donor.id)}
            title="Toggle availability"
          >
            {donor.available ? "Mark Busy" : "Mark Available"}
          </button>
        </div>
      </div>
    </div>
  );
}
