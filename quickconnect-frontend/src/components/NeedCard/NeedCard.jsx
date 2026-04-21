import "./NeedCard.css";
import { matchNeed } from "../../api";

const NeedCard = ({ need, assigned, refresh }) => {

  const hasAccepted = assigned.some(
    (a) => a.need_id === need.id && a.status === "accepted"
  );

  const hasPending = assigned.some(
    (a) => a.need_id === need.id && a.status === "pending"
  );

  return (
    <div className="need-card">

      <div className="need-header">
        <span className="need-title">{need.title}</span>

        <span className={`badge ${need.urgency}`}>
          {need.urgency}
        </span>
      </div>

      <div className="need-footer">
        <span className="location">📍 {need.location}</span>

        {hasAccepted ? (
          <button className="matched-btn" disabled>
            Matched
          </button>
        ) : hasPending ? (
          <button className="matching-btn" disabled>
            Matching...
          </button>
        ) : (
          <button
            className="match-btn"
            onClick={() => matchNeed(need.id).then(refresh)}
          >
            Match
          </button>
        )}

      </div>

    </div>
  );
};

export default NeedCard;