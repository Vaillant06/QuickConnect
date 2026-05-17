import { useNavigate } from "react-router-dom";
import MapView from "../../components/MapView/MapView";

export default function VolunteerPage() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login")
    }

    return ( 
    <>  
        <div>
            <h1>Volunteer Page</h1>
            <button onClick={logout}>Logout</button>
        </div>
        <div>
            <MapView />
        </div>
        
    </>
    )
}