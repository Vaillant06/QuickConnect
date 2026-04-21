import NeedCard from "../NeedCard/NeedCard";
import VolunteerCard from "../VolunteerCard/VolunteerCard";
import AssignmentCard from "../AssignmentCard/AssignmentCard";
import "./Sidebar.css";

const Sidebar = ({ needs, volunteers, assigned, refresh }) => {
  return (
    <div className="sidebar">

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

      <div className="section">
        <h2>👥 Volunteers</h2>
        <div className="section-list">
          {volunteers.map(v => (
            <VolunteerCard key={v.id} v={v} />
          ))}
        </div>
      </div>

      <div className="section">
        <h2>📌 Assignments</h2>
        <div className="section-list">
          {assigned.map(a => (
            <AssignmentCard key={a.id} a={a} refresh={refresh} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;