import { spawnSync } from "node:child_process";
import process from "node:process";

const docsBasePath = normalizeBasePath(process.env.DOCS_BASE_PATH ?? "/");
const storybookBasePath = normalizeBasePath(process.env.STORYBOOK_BASE_PATH ?? `${docsBasePath}storybook/`);

runCommand("npm", ["run", "build:docs"], {
  ...process.env,
  DOCS_BASE_PATH: docsBasePath
});

runCommand("npm", ["run", "build-storybook", "--", "--output-dir", "apps/docs/dist/storybook"], {
  ...process.env,
  STORYBOOK_BASE_PATH: storybookBasePath
});

function normalizeBasePath(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "/";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

function runCommand(command, args, env) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env,
    shell: process.platform === "win32",
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
