import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const shouldRunProductionSteps = process.env.VERCEL_ENV === "production" || process.env.RUN_DATABASE_MIGRATIONS === "true";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit"
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function runBin(command, args) {
  const entrypoints = {
    prisma: path.join("node_modules", "prisma", "build", "index.js"),
    next: path.join("node_modules", "next", "dist", "bin", "next")
  };
  const entrypoint = entrypoints[command];
  if (!entrypoint) {
    throw new Error(`Unknown local binary: ${command}`);
  }
  run(process.execPath, [entrypoint, ...args]);
}

if (shouldRunProductionSteps) {
  run("npm", ["run", "validate:production-env"]);
}

runBin("prisma", ["generate"]);

if (shouldRunProductionSteps) {
  runBin("prisma", ["migrate", "deploy"]);
}

runBin("next", ["build"]);
