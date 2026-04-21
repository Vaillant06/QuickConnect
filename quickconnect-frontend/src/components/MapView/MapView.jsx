import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

// 🔴 High
const redIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [40, 40],
});

// 🟡 Medium
const yellowIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize: [40, 40],
});

// 🟢 Low
const greenIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [40, 40],
});

// 🔵 Volunteer
const blueIcon = new L.Icon({
  iconUrl: "icons/volunteer.png",
  iconSize: [40, 40],
});

// ⭐ Assigned
const starIcon = new L.Icon({
  iconUrl: "icons/accepted.png",
  iconSize: [40, 40],
});

// 🎯 urgency → icon
const getIcon = (urgency) => {
  if (urgency === "high") return redIcon;
  if (urgency === "medium") return yellowIcon;
  return greenIcon;
};

const MapView = ({ needs = [], volunteers = [], assigned = [] }) => {

  const acceptedAssignments = assigned.filter((a) =>
    a.status === "accepted" &&
    a.latitude &&
    a.longitude
  );

  const validNeeds = needs.filter(n => n.latitude && n.longitude);
  const acceptedIds = acceptedAssignments.map(a => a.volunteer_id);

  console.log("Assignments:", acceptedAssignments);
  console.log("Needs:", needs);

  const center =
    validNeeds.length > 0
      ? [validNeeds[0].latitude, validNeeds[0].longitude]
      : [13.0827, 80.2707];


  return (
    <div className="map-container" style={{ position: "relative" }}>
      <MapContainer
        className="map-view"
        center={center}
        zoom={12}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🔴 Needs */}
        {needs
          .filter(n => n.latitude && n.longitude)
          .map((need) => (
            <Marker
              key={`need-${need.id}`}
              position={[need.latitude, need.longitude]}
              icon={getIcon(need.urgency)}
            >
              <Popup>
                <b style={{ textAlign: "center" }}>Title:</b> {need.title}<br />
                <b >Urgency:</b> {need.urgency}<br />
                <b>Category:</b> {need.category}<br />
                <b>Description:</b> {need.description}
              </Popup>
            </Marker>
          ))}

        {/* 🔵 Volunteers */}
        {volunteers
          .filter(v => v.latitude && v.longitude && !acceptedIds.includes(v.id))
          .map((v) => (
            <Marker
              key={`vol-${v.id}`}
              position={[v.latitude, v.longitude]}
              icon={blueIcon}
            >
              <Popup>
                <b>Volunteer:</b> {v.name}<br />
                <b>Availability:</b> {v.availability}<br />
                <b>Skills:</b> {v.skills}
              </Popup>
            </Marker>
          ))}

        {/* ⭐ Assigned Volunteers */}
        {acceptedAssignments.map((a) => (
          <Marker
            key={`assigned-${a.volunteer_id}`}
            position={[a.latitude, a.longitude]}
            icon={starIcon}
          >
            <Popup>
              ⭐ <b>{a.name}</b> <br />
              <b>Status:</b> {a.status}<br />
              <b>Score:</b> {a.score} <br />
              <b>Distance:</b> {a.distance_km} km
            </Popup>
          </Marker>
        ))}

        {/* 🔗 Connection lines */}
        {acceptedAssignments.map((a) => {
          const need = needs.find((n) => n.id === a.need_id);

          if (!need || !need.latitude || !need.longitude) return null;

          return (
            <Polyline
              key={`line-${a.volunteer_id}`}
              positions={[
                [need.latitude, need.longitude],
                [a.latitude, a.longitude],
              ]}
              color="blue"
              weight={2}
              dashArray="5, 10"
            />
          );
        })}
      </MapContainer>

      {/* 🧠 Legend */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "white",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          zIndex: 1000
        }}
      >
        <p style={{ alignItems: "center", justifyItems: "center", marginBottom: "10px" }}><b>Legend</b></p> <br />
        <img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="high" />
        <p>High Urgency</p>
        <br />
        <img src="http://maps.google.com/mapfiles/ms/icons/yellow-dot.png" alt="medium" />
        <p>Medium Urgency</p>
        <br />
        <img src="http://maps.google.com/mapfiles/ms/icons/green-dot.png" alt="low" />
        <p>Low Urgency</p>
        <br />
        <img src="icons/volunteer.png" alt="accepted" />
        <p>Volunteer</p>
        <br />  
        <img src="icons/accepted.png" alt="accepted" />
        <p>Assigned</p>
      </div>
    </div>
  );
};

export default MapView;