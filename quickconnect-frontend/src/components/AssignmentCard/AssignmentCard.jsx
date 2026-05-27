import "./AssignmentCard.css";
import { acceptAssignment } from "../../api";

const AssignmentCard = ({ a, refresh }) => {
  return (
    <div className="assign-card">

      <div className="assign-header">
        <span className="assign-name">{a.volunteer_name}</span>

        <span className={`assign-status ${a.status}`}>
          {a.status}
        </span>
      </div>

      <div className="assign-info">
        <span>⭐ {a.score}</span>
        <span>📍 {a.distance} km</span>
      </div>

      {a.status === "pending" && (
        <button
          className="accept-btn"
          onClick={() => acceptAssignment(a.id).then(refresh)}
        >
          Accept
        </button>
      )}

    </div>
  );
};

export default AssignmentCard;