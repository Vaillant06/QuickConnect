import "./VolunteerCard.css";

const VolunteerCard = ({ v }) => {
  return (
    <div className="vol-card">
      <span className="vol-name">{v.name}</span>

      <span className={`status ${v.availability}`}>
        {v.availability}
      </span>
    </div>
  );
};

export default VolunteerCard;