// import api, { route } from "@forge/api";

// const BUS_STOP_COORDS = {
//   "IMA": { lat: 47.660992, lng: -122.298439 },
//   "COMMS BLD": { lat: 47.654169, lng: -122.316808 },
//   "HUB": { lat: 47.656410, lng: -122.304840 },
//   "OKANOGAN LANE": { lat: 47.652079, lng: -122.308557 },
//   "MEANY HALL": { lat: 47.655270, lng: -122.311493 }, 
//   "FLAGPOLE": { lat: 47.658574, lng: -122.3096688 }
// };

// // Get street name from coordinates
// async function reverseGeocode(lat, lng) {
//   const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
//   const res = await fetch(url);
//   const data = await res.json();
//   if (data.results && data.results.length > 0) {
//     return data.results[0].formatted_address;
//   }
//   return "Unknown street";
// }

// // Get ETA in minutes from current location to next stop
// async function getETA(lat, lng, destLat, destLng) {
//   const apiKey = process.env.GOOGLE_MAPS_API_KEY;
//   const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${lat},${lng}&destination=${destLat},${destLng}&key=${apiKey}&mode=driving`;
//   const res = await fetch(url);
//   const data = await res.json();
//   if (data.routes && data.routes.length > 0) {
//     const durationSec = data.routes[0].legs[0].duration.value;
//     return Math.round(durationSec / 60); // minutes
//   }
//   return null;
// }

// export async function handler(event) {
//    const { busName, issueKey, lat, lng } = event.payload;

//   try {
//     // 1️⃣ Current status and next stop
//     const issueResp = await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}?fields=status`);
//     const issueData = await issueResp.json();
//     const currentStatus = issueData.fields.status.name;

//     const stops = Object.keys(BUS_STOP_COORDS);
//     const currentIndex = stops.indexOf(currentStatus);
//     const nextStop = stops[currentIndex + 1];

//     if (!nextStop) return; // final stop reached

//     const nextCoords = BUS_STOP_COORDS[nextStop];

//     // 2️⃣ Get street name
//     const streetName = await reverseGeocode(lat, lng);

//     // 3️⃣ Get ETA
//     const eta = await getETA(lat, lng, nextCoords.lat, nextCoords.lng);

//     // 4️⃣ Update Jira issue description
//     const descriptionText = `
// Current location: (${lat.toFixed(5)}, ${lng.toFixed(5)}) — ${streetName}
// Next stop: ${nextStop}
// Next stop coordinates: (${nextCoords.lat.toFixed(5)}, ${nextCoords.lng.toFixed(5)})
// Estimated time to next stop: ${eta ? eta + " minutes" : "N/A"}
// `;

//     await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ fields: { description: descriptionText } })
//     });

//     console.log(`Updated ${busName} description with location, street, and ETA`);

//     // 5️⃣ Trigger proximity check
//     await api.asApp().invoke("check-bus-proximity-fn", {
//       payload: { busName, issueKey, lat, lng }
//     });

//   } catch (err) {
//     console.error("Error in location tracker:", err);
//   }
// }

// import api, { route } from "@forge/api";

// const BUS_COORDS = {
//   "Bus-42": { lat: 47.6553, lng: -122.3035, speed: 38 },
//   "Bus-46": { lat: 47.6580, lng: -122.3080, speed: 40 }
// };

// export async function handler(event) {
//   const { busName, issueKey } = event.payload;
//   const coords = BUS_COORDS[busName] || { lat: 0, lng: 0, speed: 0 };

//   const description = `
// Current location: (${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)})
// Speed: ${coords.speed} km/h
// Next stop: TBD
// `;

//   await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ fields: { description } })
//   });

//   console.log(`Updated ${busName} description`);
// }

import api, { route } from "@forge/api";

// Hardcoded for testing — in real life, this would come from the device
const HARD_CODED_COORDS = {
  "Bus-42": { lat: 47.6553, lng: -122.3035 },
  "Bus-46": { lat: 47.6580, lng: -122.3080 }
};

export async function handler(event) {
  const { busName, issueKey } = event.payload;

  // Get current coordinates
  const busNameKey = busName.trim();
  const coords = HARD_CODED_COORDS[busNameKey] || { lat: 0, lng: 0 };

  // Update Jira issue description
  const description = `Current location of ${busName}:\nLatitude: ${coords.lat.toFixed(5)}\nLongitude: ${coords.lng.toFixed(5)}`;

  await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { description } })
  });

  console.log(`Updated ${busName} coordinates in ${issueKey}`);
}
