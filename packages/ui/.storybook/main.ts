import { dirname, join } from "node:path";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

/**
 * Resolve a package to its directory. Required in monorepos so Storybook (whose
 * core is hoisted to the workspace root) can still find the framework/addons
 * that npm nested under this package.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [getAbsolutePath("@storybook/addon-essentials")],
  framework: { name: getAbsolutePath("@storybook/react-vite"), options: {} },
  core: { disableTelemetry: true },
  async viteFinal(cfg) {
    cfg.plugins = cfg.plugins ?? [];
    cfg.plugins.push(tailwindcss());
    return cfg;
  },
};

export default config;
