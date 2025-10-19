import api, { route } from "@forge/api";

const BUS_STOP_COORDS = {
  "IMA": { lat: 47.660992, lng: -122.298439 },
  "COMMS BLD": { lat: 47.654169, lng: -122.316808 },
  "HUB": { lat: 47.656410, lng: -122.304840 },
  "OKANOGAN LANE": { lat: 47.652079, lng: -122.308557 },
  "MEANY HALL": { lat: 47.655270, lng: -122.311493 }, 
  "FLAGPOLE": { lat: 47.658574, lng: -122.3096688 }
};

// Calculate distance between two coordinates in meters
function distance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const toRad = (x) => (x * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a = Math.sin(Δφ/2)**2 +
            Math.cos(φ1)*Math.cos(φ2) *
            Math.sin(Δλ/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function handler(event) {
  const { busName, issueKey, lat, lng } = event.payload;

  try {
    // Get current issue status
    const issueResponse = await api.asApp().requestJira(
      route`/rest/api/3/issue/${issueKey}?fields=status`
    );
    const issueData = await issueResponse.json();
    const currentStatus = issueData.fields.status.name;

    // Update description with current location
    const description = `
Bus: ${busName}
Current Location: ${lat.toFixed(5)}, ${lng.toFixed(5)}
Current Status: ${currentStatus}
Last Updated: ${new Date().toISOString()}
    `.trim();

    await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: { description } })
    });

    console.log(`Updated location for ${busName}: ${lat}, ${lng}`);

    // Check proximity to next stop
    const statusOrder = Object.keys(BUS_STOP_COORDS);
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[currentIndex + 1];

    if (!nextStatus) {
      console.log(`${busName} has reached the final stop`);
      return { success: true, message: "Final stop reached" };
    }

    // Calculate distance to next stop
    const nextCoords = BUS_STOP_COORDS[nextStatus];
    const dist = distance(lat, lng, nextCoords.lat, nextCoords.lng);

    console.log(`Bus ${busName} is ${dist.toFixed(1)}m from ${nextStatus}`);

    // If within 50 meters, transition to next status
    if (dist < 50) {
      // Get available transitions
      const transitionsResp = await api.asApp().requestJira(
        route`/rest/api/3/issue/${issueKey}/transitions`,
        { method: "GET" }
      );
      const transitions = await transitionsResp.json();
      
      // Find transition to next status
      const nextTransition = transitions.transitions.find(
        t => t.name === nextStatus || t.to.name === nextStatus
      );

      if (nextTransition) {
        await api.asApp().requestJira(
          route`/rest/api/3/issue/${issueKey}/transitions`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transition: { id: nextTransition.id } })
          }
        );
        console.log(`Moved ${busName} to ${nextStatus}`);
        return { 
          success: true, 
          message: `Transitioned to ${nextStatus}`,
          distance: dist 
        };
      } else {
        console.log(`No transition found to ${nextStatus}`);
      }
    }

    return { 
      success: true, 
      message: "Location updated",
      distance: dist,
      nextStop: nextStatus 
    };

  } catch (err) {
    console.error(`Error in location tracker:`, err);
    return { success: false, error: err.message };
  }
}