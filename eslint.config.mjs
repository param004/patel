import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Registered ThreeUI source, vendored verbatim under a verified SHA-256.
    // Linting it is not actionable because the fix would mean editing
    // hash-verified files, so these are excluded rather than rewritten.
    "src/shaders/temple-night/TempleNightScene.tsx",
    "src/shaders/temple-night/templeNightRenderer.js",
    // Registered Kage landing-page source, vendored verbatim under verified
    // SHA-256 digests. Same reasoning: a lint fix would mean editing a
    // hash-verified file, so these are excluded rather than rewritten.
    "src/shaders/landing-pages/LandingPages.tsx",
    "src/shaders/landing-pages/LandingPageFrame.tsx",
    "src/shaders/landing-pages/pageTypography.ts",
    "src/shaders/landing-pages/pageRecipes.ts",
    "src/shaders/threeui.css",
    // Registered Kage landing-page document, styles and runtime, vendored
    // verbatim under verified SHA-256 digests. kage.html is a complete
    // authored page and three.min.js is a minified Three.js build, so linting
    // either is not actionable.
    "public/landing-pages/**",
  ]),
  {
    // The Kage component imports a dozen sibling-scene modules that the
    // registered bundle does not ship. Their stubs have to match the call
    // sites, so a parameter can be required for type-checking yet unused.
    files: ["src/shaders/**/*.ts", "src/shaders/**/*.js"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
]);

export default eslintConfig;
