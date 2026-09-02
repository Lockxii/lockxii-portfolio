import { fetchActivity } from "../lib/github-activity.mjs";

export default async function handler(request, response) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  if (request.method !== "GET") {
    response.statusCode = 405;
    response.setHeader("Allow", "GET");
    response.setHeader("Cache-Control", "no-store");
    response.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }
  try {
    const activity = await fetchActivity();
    response.setHeader("Cache-Control", "public, max-age=0, s-maxage=21600, stale-while-revalidate=86400");
    response.end(JSON.stringify(activity));
  } catch (error) {
    console.error("GitHub activity refresh failed:", error.message);
    response.statusCode = 503;
    response.setHeader("Cache-Control", "no-store");
    response.end(JSON.stringify({ error: "GitHub activity is temporarily unavailable." }));
  }
}
