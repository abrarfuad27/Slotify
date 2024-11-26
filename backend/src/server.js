const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Enable CORS to allow requests from the local frontend
app.use(cors());

// Define the API endpoint
app.get('//message', (req, res) => {
  res.json({ msg: 'Hello World' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend is running`);
});
