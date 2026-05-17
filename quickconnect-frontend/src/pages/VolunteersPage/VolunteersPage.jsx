import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import { fetchSingleVolunteer, fetchAssignments } from "../../api";
import MapView from "../../components/MapView/MapView";

export default function VolunteerPage() {
    const navigate = useNavigate();
    const [volunteer, setVolunteer] = useState(null);
    const [assigned, setAssigned] = useState([]);

    const loadData = () => {
        fetchAssignments().then(d => setAssigned(d.data));
      };

    useEffect(() => {
    const token = localStorage.getItem("token");

        if (!token) return;

        const decoded = jwtDecode(token);

        const volunteerId = decoded.sub;

        fetchSingleVolunteer(volunteerId)
            .then(data => setVolunteer(data.data))
            .catch(err => console.error(err));

        loadData();

    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login")
    }

    return ( 
    <>  
        <div>
            <h1>Volunteer Page</h1>
            {volunteer && (
                <>
                <div>
                    <p>Name: {volunteer.name}</p>
                    <p>Email: {volunteer.email}</p>
                </div>
                </>
            )}
            <button onClick={logout}>Logout</button>
        </div>
        <div className="map">
            <MapView
                assigned={assigned}
                volunteers={volunteer}
            />
        </div>
        
    </>
    )
}