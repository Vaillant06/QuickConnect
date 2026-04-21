import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🔴 High
const redIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [35, 40],
});

// 🟡 Medium
const yellowIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize: [35, 40],
});

// 🟢 Low
const greenIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [35, 40],
});

// 🔵 Volunteer
const blueIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [35, 40],
});

// ⭐ Assigned
const starIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  iconSize: [35, 40],
});

// 🎯 urgency → icon
const getIcon = (urgency) => {
  if (urgency === "high") return redIcon;
  if (urgency === "medium") return yellowIcon;
  return greenIcon;
};

const MapView = ({ needs = [], volunteers = [], assigned = [] }) => {

  // ✅ FILTER ONLY ACCEPTED HERE (FIX)
  const acceptedAssignments = assigned.filter((a) =>
    a.status === "accepted" &&
    a.latitude &&
    a.longitude
  );


  // ✅ Safe center
  const validNeeds = needs.filter(n => n.latitude && n.longitude);
  const acceptedIds = acceptedAssignments.map(a => a.volunteer_id);

  const center =
    validNeeds.length > 0
      ? [validNeeds[0].latitude, validNeeds[0].longitude]
      : [13.0827, 80.2707];


  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "500px", width: "100%" }}
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
                <b>{need.title}</b> <br />
                {need.description}
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
                <b>Volunteer: {v.name}</b>
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
              Score: {a.score} <br />
              Distance: {a.distance_km} km
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
              color="orange"
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
        <b>Legend</b> <br />
        🔴 High Need <br />
        🟡 Medium Need <br />
        🟢 Low Need <br />
        🔵 Volunteer <br />
        ⭐ Assigned
      </div>
    </div>
  );
};

export default MapView;