import { useEffect, useState } from "react";
import MapView from "../components/MapView/MapView";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

import {
  fetchNeeds,
  fetchVolunteers,
  fetchAssignments
} from "../api";

const Dashboard = () => {
  const [needs, setNeeds] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [assigned, setAssigned] = useState([]);

  const loadData = () => {
    fetchNeeds().then(d => setNeeds(d.data));
    fetchVolunteers().then(d => setVolunteers(d.data));
    fetchAssignments().then(d => setAssigned(d.data));
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 3000); 
    return () => clearInterval(interval);
  }, []);

  return (<>
    <div>
        <Header />
    </div>
    <div className="container">
        <Sidebar
            needs={needs}
            volunteers={volunteers}
            assigned={assigned}
            refresh={loadData}
        />

        <div className="map">
            <MapView
            needs={needs}
            volunteers={volunteers}
            assigned={assigned}
            />
        </div>
    </div>
    </>
    );
};

export default Dashboard;