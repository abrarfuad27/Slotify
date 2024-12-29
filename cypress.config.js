const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000", // Replace with your application's local development URL
    setupNodeEvents(on, config) {
      // No need to start servers here
    },
  },
});
