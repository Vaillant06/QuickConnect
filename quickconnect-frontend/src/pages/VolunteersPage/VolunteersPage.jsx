import { useNavigate } from "react-router-dom";

export default function VolunteerPage() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login")
    }

    return ( 
    <>
        <h1>Volunteer Page</h1>
        <button onClick={logout}>Logout</button>
    </>
    )
}