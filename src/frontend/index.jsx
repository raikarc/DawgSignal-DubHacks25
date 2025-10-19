import React, { useState, useEffect } from "react";
import { invoke } from "@forge/bridge";
import { render } from "react-dom";
import { Stack, Text, Strong, Button } from "@forge/react";

function App() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [status, setStatus] = useState("Getting location...");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [busName, setBusName] = useState("");
  const [issueKey, setIssueKey] = useState("");

  // Get bus info from Jira context
  useEffect(() => {
    const getContext = async () => {
      try {
        const context = await invoke("getContext");
        setIssueKey(context.extension.issue.key);
        setBusName(context.extension.issue.fields.summary);
      } catch (err) {
        console.error("Error getting context:", err);
      }
    };
    getContext();
  }, []);

  // Function to send location to backend
  const sendLocation = async (lat, lng) => {
    if (!issueKey || !busName) {
      setStatus("Waiting for issue context...");
      return;
    }

    try {
      const result = await invoke("loc-tracker-fn", {
        busName,
        issueKey,
        lat,
        lng
      });
      
      setStatus(result.message || "Location sent successfully");
      setLastUpdate(new Date().toLocaleTimeString());
      
      if (result.distance) {
        setStatus(`${result.message} (${result.distance.toFixed(0)}m to next stop)`);
      }
    } catch (err) {
      console.error("Error sending location:", err);
      setStatus(`Error: ${err.message}`);
    }
  };

  // Get current position from browser
  const updateLocation = () => {
    if (navigator.geolocation) {
      setStatus("Getting GPS location...");
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLocation({ lat, lng });
          await sendLocation(lat, lng);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setStatus(`GPS Error: ${error.message}`);
        },
        { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0 
        }
      );
    } else {
      setStatus("Geolocation not supported by browser");
    }
  };

  // Auto-update location every 15 seconds
  useEffect(() => {
    if (issueKey && busName) {
      updateLocation(); // Initial update
      const interval = setInterval(updateLocation, 15000);
      return () => clearInterval(interval);
    }
  }, [issueKey, busName]);

  return (
    <Stack space="large">
      <Text><Strong>Bus Location Tracker</Strong></Text>
      
      <Stack space="small">
        <Text>Bus: {busName || "Loading..."}</Text>
        <Text>Issue: {issueKey || "Loading..."}</Text>
      </Stack>

      <Stack space="small">
        <Text>Status: {status}</Text>
        <Text>
          Current Location:{" "}
          {location.lat && location.lng
            ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
            : "Waiting for GPS..."}
        </Text>
        {lastUpdate && <Text>Last Update: {lastUpdate}</Text>}
      </Stack>

      <Button 
        appearance="primary"
        text="Update Location Now"
        onClick={updateLocation}
      />
    </Stack>
  );
}

render(<App />, document.getElementById("root"));