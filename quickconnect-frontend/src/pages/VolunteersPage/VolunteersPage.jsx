import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import { fetchSingleVolunteer } from "../../api";
import MapView from "../../components/MapView/MapView";

export default function VolunteerPage() {
    const navigate = useNavigate();
    const [volunteer, setVolunteer] = useState(null);

    useEffect(() => {
    const token = localStorage.getItem("token");

        if (!token) return;

        const decoded = jwtDecode(token);

        const volunteerId = decoded.sub;

        fetchSingleVolunteer(volunteerId)
            .then(data => setVolunteer(data))
            .catch(err => console.error(err));

        console.log(volunteer);

    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login")
    }

    return ( 
    <>  
        <div>
            <h1>Volunteer Page</h1>
            <p>{volunteer.name}</p>
            <p>{volunteer.email}</p>
            {volunteer && (
                <>
                    <p>{volunteer.name}</p>
                    <p>{volunteer.email}</p>
                </>
            )}
            <button onClick={logout}>Logout</button>
        </div>
        <div>
            <MapView />
        </div>
        
    </>
    )
}