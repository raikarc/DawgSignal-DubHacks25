import api, { route } from "@forge/api";

const BUS_STOP_COORDS = {
  "IMA": { lat: 47.660992, lng: -122.298439 },
  "COMMS BLD": { lat: 47.654169, lng: -122.316808 },
  "HUB": { lat: 47.656410, lng: -122.304840 },
  "OKANOGAN LANE": { lat: 47.652079, lng: -122.308557 },
  "MEANY HALL": { lat: 47.655270, lng: -122.311493 }, 
  "FLAGPOLE": { lat: 47.658574, lng: -122.3096688 }
};

// small helper
function distance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // meters
  const toRad = (x) => (x * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ/2)**2 +
            Math.cos(φ1)*Math.cos(φ2) *
            Math.sin(Δλ/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // distance in meters
}

export async function handler(event) {
  const { busName, issueKey, lat, lng } = event.payload;

  try {
    // Get current issue status
    const issueResponse = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}?fields=status`);
    const issueData = await issueResponse.json();
    const currentStatus = issueData.fields.status.name;

    // Find next status in workflow (simplified logic)
    const statusOrder = Object.keys(BUS_STOP_COORDS);
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[currentIndex + 1];

    if (!nextStatus) return; // already at final stop

    // Compare current location to next stop location
    const nextCoords = BUS_STOP_COORDS[nextStatus];
    const dist = distance(lat, lng, nextCoords.lat, nextCoords.lng);

    console.log(`Bus ${busName} is ${dist.toFixed(1)}m from ${nextStatus}`);

    // 4️⃣ If within 50m, transition issue to next status
    if (dist < 50) {
      const transitionsResp = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/transitions`, { method: "GET" });
      const transitions = await transitionsResp.json();
      const nextTransition = transitions.transitions.find(t => t.name === nextStatus);

      if (nextTransition) {
        await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}/transitions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transition: { id: nextTransition.id } })
        });
        console.log(`Moved ${busName} to ${nextStatus}`);
      }
    }
  } catch (err) {
    console.error(`Error checking bus proximity:`, err);
  }
}
