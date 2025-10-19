// import React, { useState, useEffect } from "react";
// import { invoke } from "@forge/bridge";

// export default function BusLocationReporter({ busName, issueKey }) {
//   const [location, setLocation] = useState({ lat: null, lng: null });
//   const [status, setStatus] = useState("Idle");

//   // Function to get iPhone / browser GPS
//   const updateLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         async (position) => {
//           const lat = position.coords.latitude;
//           const lng = position.coords.longitude;
//           setLocation({ lat, lng });

//           // Send to Forge backend function
//           try {
//             await invoke("loc-tracker-fn", {
//               busName,
//               issueKey,
//               lat,
//               lng,
//             });
//             setStatus("Location sent successfully");
//           } catch (err) {
//             console.error("Error sending location:", err);
//             setStatus("Error sending location");
//           }
//         },
//         (error) => {
//           console.error("Geolocation error:", error);
//           setStatus("Unable to get location");
//         },
//         { enableHighAccuracy: true }
//       );
//     } else {
//       console.error("Geolocation not supported");
//       setStatus("Geolocation not supported");
//     }
//   };

//   // Auto-update location every 15 seconds
//   useEffect(() => {
//     const interval = setInterval(updateLocation, 15000); // 15s
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div>
//       <h3>Bus: {busName}</h3>
//       <p>Status: {status}</p>
//       <p>
//         Current Location:{" "}
//         {location.lat && location.lng
//           ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
//           : "Fetching..."}
//       </p>
//       <button onClick={updateLocation}>Send Location Now</button>
//     </div>
//   );
// }

// import React from 'react';
// import ReactDOM from 'react-dom/client';

// const App = () => {
//   // Hardcoded bus location
//   const busLocation = {
//     bus_id: "BUS-42",
//     route: "Downtown Loop",
//     latitude: 47.6553,
//     longitude: -122.3035,
//     speed_kmh: 38,
//     status: "on route",
//     last_updated: "2025-10-19T19:32:00Z"
//   };

//   // Render it on screen (you can later replace this with a map)
//   return (
//     <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
//       <h2>Bus Tracker</h2>
//       <p><b>Bus ID:</b> {busLocation.bus_id}</p>
//       <p><b>Route:</b> {busLocation.route}</p>
//       <p><b>Latitude:</b> {busLocation.latitude}</p>
//       <p><b>Longitude:</b> {busLocation.longitude}</p>
//       <p><b>Speed:</b> {busLocation.speed_kmh} km/h</p>
//       <p><b>Status:</b> {busLocation.status}</p>
//       <p><b>Last Updated:</b> {busLocation.last_updated}</p>
//     </div>
//   );
// };

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<App />);

// import React, { useEffect, useState } from "react";
// import { invoke } from "@forge/bridge";
// import { render } from "react-dom";
// import { Button, Strong, Text, Stack } from "@forge/react";

// function App() {
//   const [buses, setBuses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBuses = async () => {
//       try {
//         const busData = await invoke('getBuses');
//         setBuses(busData);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchBuses();
//   }, []);

//   if (loading) {
//     return <Text>Loading buses...</Text>;
//   }

//   if (error) {
//     return <Text>Error: {error}</Text>;
//   }

//   return (
//     <Stack space="large">
//       <Text><Strong>Bus Tracker</Strong></Text>
//       {buses.map(bus => (
//         <Stack key={bus.key} space="small">
//           <Text>Bus: {bus.fields.summary}</Text>
//           <Text>Status: {bus.fields.status.name}</Text>
//           <Text>Description: {bus.fields.description || 'No location data yet'}</Text>
//           <Button 
//             appearance="primary"
//             text="View Details"
//             onClick={() => window.open(`/browse/${bus.key}`, '_blank')}
//           />
//         </Stack>
//       ))}
//     </Stack>
//   );
// }

// render(<App />, document.getElementById("root"));

import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import { render } from "react-dom";
import { Stack, Text, Strong } from "@forge/react";

function App() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        // Call your loc-tracker-fn in Forge
        const busData = await invoke("loc-tracker-fn", { payload: {} });
        
        // Transform object to array for React mapping
        const busArray = Object.entries(busData).map(([busName, coords]) => ({
          busName,
          ...coords
        }));

        setBuses(busArray);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch bus data");
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  if (loading) return <Text>Loading buses...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <Stack space="large">
      <Text><Strong>Bus Tracker</Strong></Text>
      {buses.map((bus) => (
        <Stack key={bus.busName} space="small">
          <Text>Bus: {bus.busName}</Text>
          <Text>Latitude: {bus.lat}</Text>
          <Text>Longitude: {bus.lng}</Text>
          <Text>Speed: {bus.speed} km/h</Text>
        </Stack>
      ))}
    </Stack>
  );
}

render(<App />, document.getElementById("root"));

