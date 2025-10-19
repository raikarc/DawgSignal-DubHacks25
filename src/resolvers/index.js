import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";

const resolver = new Resolver();

// Get all buses in the project
resolver.define("getBuses", async ({ context }) => {
  const response = await api.asUser().requestJira(
    route`/rest/api/3/search?jql=project=${context.extensionContext.projectKey}`
  );
  const data = await response.json();
  return data.issues;
});

// Get current context for the frontend
resolver.define("getContext", async ({ context }) => {
  return context;
});

// Location tracker function (called from frontend)
resolver.define("loc-tracker-fn", async ({ payload }) => {
  const { busName, issueKey, lat, lng } = payload;

  // Import and call the location tracker handler
  const { handler } = await import("./locationTracker.js");
  return await handler({ payload: { busName, issueKey, lat, lng } });
});

export const handler = resolver.getDefinitions();