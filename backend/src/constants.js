// Backend port: change as needed (4000 for local, 5000 for SOCS server)
const backendPort = 4000;
// const backendPort = 5000; 

// Localhost: port 3000 by default
const frontendPort = 3000; // Change if needed
const frontendUrl = `http://localhost:${frontendPort}`;

// Server URL: uncomment if using SOCS server
// const frontendUrl = "https://fall2024-comp307-group06.cs.mcgill.ca";

module.exports = { backendPort, frontendUrl };