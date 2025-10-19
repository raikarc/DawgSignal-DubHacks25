// import api, { route } from "@forge/api";

// export async function handler(event, context) {
//   try {
//     const issue = event.issue;
//     const busName = issue.fields.summary;
//     const issueKey = issue.key;

//     console.log(`New bus created: ${busName} (${issueKey})`);

//     // Start the location tracker Forge function
//     await api.asApp().invoke("loc-tracker-fn", {
//       payload: { busName, issueKey }
//     });

//     const initialDescription = `Tracking started for ${busName}.\nInitial coordinates pending...`;

//     await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         fields: {
//           description: initialDescription
//         }
//       })
//     });

//     console.log(`Bus ${busName} initialized in Jira.`);
//   } catch (error) {
//     console.error("Error initializing bus tracking:", error);
//   }
// }

// import api, { route } from "@forge/api";

// export async function handler(event) {
//   const issueKey = event.issue.key;
//   const busName = event.issue.fields.summary;

//   // Start location tracking
//   await api.asApp().invoke("loc-tracker-fn", {
//     payload: { busName, issueKey }
//   });

//   // Initialize description
//   const initialDescription = `Tracking started for ${busName}.\nCurrent coordinates: pending...`;
//   await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ fields: { description: initialDescription } })
//   });

//   console.log(`Bus ${busName} tracking initialized`);
// }

import api, { route } from "@forge/api";

export async function handler(event) {
  const issueKey = event.issue.key;
  const busName = event.issue.fields.summary;

  console.log(`New bus created: ${busName} (${issueKey})`);

  // Initialize description
  const initialDescription = `Tracking started for ${busName}.\nCurrent coordinates: pending...`;
  await api.asApp().requestJira(route`/rest/api/3/issue/${issueKey}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { description: initialDescription } })
  });

  // Optionally, immediately start first location update
  await api.asApp().invoke("loc-tracker-fn", { payload: { busName, issueKey } });
}

