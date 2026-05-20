import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import {
    fetchSingleVolunteer,
    fetchVolunteerAssignments,
    fetchNeeds
} from "../../api";

import MapView from "../../components/MapView/MapView";

export default function VolunteerPage() {

    const navigate = useNavigate();

    const [needs, setNeeds] = useState([]);
    const [volunteer, setVolunteer] = useState(null);
    const [assigned, setAssigned] = useState([]);
    const [startTask, setStartTask] = useState(null);
    const [endTask, setEndTask] = useState(null);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const loadData = async () => {

            try {

                const decoded = jwtDecode(token);
                const volunteerId = Number(decoded.sub);

                const volunteerData = await fetchSingleVolunteer(volunteerId);
                setVolunteer(volunteerData.data);

                const assignmentData = await fetchVolunteerAssignments(volunteerId);
                setAssigned(assignmentData.data);

                const needsData = await fetchNeeds();
                setNeeds(needsData.data);

                setStartTask(true);
                setEndTask(true);

            } catch (err) {

                console.error(err);
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        loadData();

        const interval = setInterval(() => {
            loadData();
        }, 10000);
        
        return () => clearInterval(interval);

    }, [navigate]);

    const startTask = () => {
        window.alert("Task Started!");
    }

    const endTask = () => {
        window.alert("Task Completed!");
    };

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
                        <div className="assignment" key={assignment.id}>
                            <p>Need ID: {assignment.need_id}</p>
                            <p>Status: {assignment.status}</p>
                            <p>Latitude: {assignment.latitude}</p>
                            <p>Longitude: {assignment.longitude}</p>
                            <p>
                                Assigned At: {
                                    new Date(assignment.assigned_at).toLocaleString(
                                        "en-IN",
                                        {
                                            timeZone: "Asia/Kolkata",
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit"
                                        }
                                    )
                                }
                            </p>
                            <p>Distance: {assignment.distance} km</p>
                        </div>
                    ))
                ) : (
                    <p>No assignments found</p>
                )}
            </div>

            <div className="status">
                {startTask && <button onClick={startTask}>Start Task</button>}
                {endTask && <button onClick={endTask}>Task Completed</button>}
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