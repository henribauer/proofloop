// @ts-check
/** @type {import("@stryker-mutator/api/core").PartialStrykerOptions} */
export default {
  testRunner: "vitest",
  mutate: ["src/calculator.ts"],
  reporters: ["clear-text", "progress", "html"],
  thresholds: { high: 90, low: 80, break: null },
  // Stryker rewrites tsconfig paths through the TypeScript JS API, which TypeScript 7 (native) no longer has
  // ("ts.parseConfigFileTextToJson is not a function"). Our tsconfig has no extends or references to rewrite, so
  // name a file that does not exist and Stryker skips the step.
  tsconfigFile: "no-tsconfig-rewrite.json",
};
