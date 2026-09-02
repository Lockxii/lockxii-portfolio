import { mkdir, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { fetchActivity } from "../lib/github-activity.mjs";

const OUTPUT = new URL("../src/data/github-activity.json", import.meta.url);

export async function refreshActivity({ output = OUTPUT, ...options } = {}) {
  const snapshot = await fetchActivity(options);
  const outputPath = output instanceof URL ? fileURLToPath(output) : output;
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath + ".tmp", JSON.stringify(snapshot, null, 2) + "\n");
  await rename(outputPath + ".tmp", outputPath);
  return snapshot;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const snapshot = await refreshActivity();
    console.log("Updated @" + snapshot.username + ": " + snapshot.totalContributions + " contributions, " + snapshot.from + " to " + snapshot.to + ".");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
