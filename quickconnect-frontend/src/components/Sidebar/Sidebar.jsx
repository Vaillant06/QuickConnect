import { useNavigate } from "react-router-dom";

import NeedCard from "../NeedCard/NeedCard";
import VolunteerCard from "../VolunteerCard/VolunteerCard";
import AssignmentCard from "../AssignmentCard/AssignmentCard";
import "./Sidebar.css";

const Sidebar = ({ needs, volunteers, assigned, refresh }) => {
  const navigate = useNavigate();

  const clearAssignments = async () => {
    if (!window.confirm("Clear all assignments?")) return;

    await fetch(`${import.meta.env.VITE_API_URL}/assignments`, {
      method: "DELETE",
    });

    refresh();
  };

  return (
    <div className="sidebar">

      {/* 🚨 Needs */}
      <div className="section">
        <h2>🚨 Needs</h2>
        <div className="section-list">
          {needs.map(n => (
            <NeedCard 
              key={n.id} 
              need={n} 
              assigned={assigned} 
              refresh={refresh} 
            />
          ))}
        </div>
      </div>

      {/* 👥 Volunteers */}
      <div className="section">
        <h2>👥 Volunteers</h2>
        <div className="section-list">
          {volunteers.map(v => (
            <VolunteerCard key={v.id} v={v} />
          ))}
        </div>
      </div>

      {/* 📌 Assignments */}
      <div className="section">
        <div className="section-header">
          <h2>📌 Assignments</h2>
        </div>

        {assigned.length === 0 ? (
          <p>No assignments yet</p>
          ) : (
            <div className="section-list">
              {assigned.map(a => (
                <AssignmentCard key={a.id} a={a} refresh={refresh} />
              ))}
            </div>
          )
        }
      </div>

      {/* ⚙️ Demo Purpose */}
      <div className="section">
        <div className="section-header">
          <h2>⚙️ Demo Purpose</h2>
        </div>

        <div className="demo-buttons">
          <button className="clear-btn" onClick={clearAssignments}>
            Clear All Assignments
          </button>

          <button 
            className="add-need-btn"
            onClick={() => navigate("/create-need")}
          >
            ➕ Add Need
          </button>

        </div>
      </div>
    </div>
  );
};

export default Sidebar;