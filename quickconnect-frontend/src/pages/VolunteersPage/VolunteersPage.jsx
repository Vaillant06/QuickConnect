import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import {
    fetchSingleVolunteer,
    fetchAssignments,
    fetchNeeds
} from "../../api";

import MapView from "../../components/MapView/MapView";

export default function VolunteerPage() {

    const navigate = useNavigate();

    const [needs, setNeeds] = useState([]);
    const [volunteer, setVolunteer] = useState(null);
    const [assigned, setAssigned] = useState([]);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {

            const decoded = jwtDecode(token);

            const volunteerId = Number(decoded.sub);

            fetchSingleVolunteer(volunteerId)
                .then(data => setVolunteer(data.data))
                .catch(err => console.error(err));

            fetchAssignments(volunteerId)
                .then(data => setAssigned(data.data))
                .catch(err => console.error(err));
            
            fetchNeeds().then(d => setNeeds(d.data));

        } catch (err) {

            console.error("Invalid token", err);

            localStorage.removeItem("token");

            navigate("/login");
        }
        
    }, [navigate]);


    useEffect(() => {
        console.log("Assigned:", assigned);
    }, [assigned]);

    useEffect(() => {
        console.log("Volunteer:", volunteer);
    }, [volunteer]);

    useEffect(() => {
        console.log("Needs:", needs);
    }, [needs]);
    
    const logout = () => {

        localStorage.removeItem("token");

        navigate("/login");
    };

    return (
        <>
            <div>
                <h1>Volunteer Page</h1>

                {volunteer ? (
                    <div>
                        <p>Name: {volunteer.name}</p>
                        <p>Email: {volunteer.email}</p>
                        <p>Skills: {volunteer.skills}</p>
                        <p>Availability: {volunteer.availability}</p>
                    </div>
                ) : (
                    <p>Loading Details...</p>
                )}

                <button onClick={logout}>
                    Logout
                </button>
            </div>

            <div>
                <h2>Assignments</h2>

                {assigned.length > 0 ? (
                    assigned.map((assignment) => (
                        <div key={assignment.id}>
                            <p>Need ID: {assignment.need_id}</p>
                            <p>Status: {assignment.status}</p>
                        </div>
                    ))
                ) : (
                    <p>No assignments found</p>
                )}
            </div>

            <div className="map">
                <MapView
                    assigned={assigned}
                    volunteers={volunteer ? [volunteer] : []}
                    needs={needs}   
                />
            </div>
        </>
    );
}