const { spawnSync } = require("child_process");
const path = require("path");

const command = "npx prisma generate";
const result = spawnSync(command, {
  shell: true,
  stdio: "inherit",
  cwd: path.resolve(__dirname, ".."),
});

if (result.error) {
  console.warn("Failed to run prisma generate during postinstall:", result.error);
}

if (result.status !== 0) {
  console.warn("prisma generate failed during postinstall, continuing with fallback.");
}

process.exit(0);
