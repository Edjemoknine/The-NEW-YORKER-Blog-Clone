console.log("NODE VERSION:", process.version);

console.log("SEMVER VERSION:", require("semver/package.json").version);

console.log("SEMVER TRUNCATE:", require.resolve("semver/functions/truncate"));
import app from "./app.ts";

export default app;
