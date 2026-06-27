// Dynamic Expo config.
//
// Reads the static config from app.json and injects a web `baseUrl` only when
// EXPO_BASE_URL is set (used by the GitHub Pages build, which serves the app
// from the /HomeBudget/ subpath). Vercel builds with no env set → root.
module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    ...(process.env.EXPO_BASE_URL ? { baseUrl: process.env.EXPO_BASE_URL } : {}),
  },
});
