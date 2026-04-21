import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CreateNeedPage.css";

const CreateNeedPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    urgency: "",
    location: "",
    latitude: "",
    longitude: ""
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setForm((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
      },
      (error) => {
        alert("Location access denied");
      }
    );
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // 🛑 prevent double click

    setLoading(true);

    try {
      await fetch("http://127.0.0.1:8000/needs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
        }),
      });

      alert("Need created");
      navigate("/");

    } catch (err) {
      alert("Error creating need");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <div className="form-container">
        <p className="back-btn" onClick={() => navigate("/")}>⬅ Go Back</p>

        <h2> ➕ Add New Need</h2>

        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" onChange={handleChange} required />
          <textarea name="description" placeholder="Description" onChange={handleChange} required />
          <input name="location" placeholder="Location" onChange={handleChange} required />
          <input
            name="latitude"
            value={form.latitude || ""}
            readOnly
          />

          <input
            name="longitude"
            value={form.longitude || ""}
            readOnly
          />
          <button type="button" className="location-btn" onClick={getLocation}>
            📍 Use My Location
          </button>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Need"}
          </button>        </form>

        <div className="demo-data">
          <p>This is for demo purpose.</p><br />
          <p>Click 'Use My Location' button to get the coordinates of the location.</p>
        </div>
      </div>
    </div>


  );
};

export default CreateNeedPage;