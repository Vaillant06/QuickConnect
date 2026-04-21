import { useEffect, useState } from "react";
import MapView from "./components/MapView/MapView.jsx";

const App = () => {
  const [needs, setNeeds] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [assigned, setAssigned] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/needs")
      .then((res) => res.json())
      .then((data) => setNeeds(data.data));

    fetch("http://127.0.0.1:8000/volunteers")
      .then((res) => res.json())
      .then((data) => setVolunteers(data.data));

    fetch("http://127.0.0.1:8000/assignments")
      .then((res) => res.json())
      .then((data) => setAssigned(data.data));
  }, []);

  return <MapView needs={needs} volunteers={volunteers} assigned={assigned}/>;
};

export default App;