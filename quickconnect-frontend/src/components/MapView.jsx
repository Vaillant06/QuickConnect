import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🔴 High
const redIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [25, 41],
});

// 🟡 Medium
const yellowIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize: [25, 41],
});

// 🟢 Low
const greenIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [25, 41],
});

// 🔵 Volunteer
const blueIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [25, 41],
});

// ⭐ Assigned
const starIcon = new L.Icon({
  iconUrl: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
  iconSize: [25, 41],
});

// 🎯 urgency → icon
const getIcon = (urgency) => {
  if (urgency === "high") return redIcon;
  if (urgency === "medium") return yellowIcon;
  return greenIcon;
};

const MapView = ({ needs = [], volunteers = [], assigned = [] }) => {
  
  // ✅ Safe center fallback
  const validNeeds = needs.filter(n => n.latitude && n.longitude);

  const center =
    validNeeds.length > 0
      ? [validNeeds[0].latitude, validNeeds[0].longitude]
      : [13.0827, 80.2707]; // Chennai fallback

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
          .filter(v => v.latitude && v.longitude)
          .map((v) => (
            <Marker
              key={`vol-${v.id}`}
              position={[v.latitude, v.longitude]}
              icon={blueIcon}
            >
              <Popup>
                <b>{v.name}</b>
              </Popup>
            </Marker>
          ))}

        {/* ⭐ Assigned Volunteers */}
        {assigned
          .filter(a => a.latitude && a.longitude)
          .map((a) => (
            <Marker
              key={`assigned-${a.volunteer_id}`}
              position={[a.latitude, a.longitude]}
              icon={starIcon}
            >
              <Popup>
                ⭐ <b>{a.name}</b> <br />
                Score: {a.score} <br />
                Distance: {a.distance_km ?? "N/A"} km
              </Popup>
            </Marker>
          ))}

        {/* 🔗 Connection lines */}
        {assigned.map((a) => {
          const need = needs.find((n) => n.id === a.need_id);

          if (
            !need ||
            !need.latitude ||
            !need.longitude ||
            !a.latitude ||
            !a.longitude
          ) return null;

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
          boxShadow: "0 0 10px rgba(0,0,0,0.2)"
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