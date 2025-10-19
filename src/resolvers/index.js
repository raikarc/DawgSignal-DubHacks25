// resolver.js
import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";

const resolver = new Resolver();

resolver.define("getBuses", async ({ context }) => {
  const response = await api.asUser().requestJira(route`/rest/api/3/search?jql=project=${context.extensionContext.projectKey}`);
  const data = await response.json();
  return data.issues;
});

export const handler = resolver.getDefinitions();
