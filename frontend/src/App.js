import React, { useState } from 'react';
import './App.css';
import Landing from './pages/landing';
// import axios from 'axios';

function App() {
  // State to store the message from the backend
  const [message, setMessage] = useState('');

  const publicUrl = 'https://fall2024-comp307-group06.cs.mcgill.ca/api';
  // const publicUrl = 'http://localhost:5000';

  // Function to fetch the message from the backend
  const fetchMessage = async () => {
    try {
      const response = await fetch(`${publicUrl}/message`);
      // const response = axios.get(`${publicUrl}/message`);
      console.log(`${publicUrl}/message`);
      const data = await response.json();
      console.log(data);
      setMessage(data.msg); // Update state with the backend message
    } catch (error) {
      console.error('Error fetching the message:', error);
      setMessage(`Error fetching message: ${error}`);
    }
  };

  return (
    // Browser-Router will be inserted

    <div className="App">
      {/* <button onClick={fetchMessage}>Click to print Hello World</button> */}
      {/* <div>{message}</div> */}
      <Landing></Landing>
    </div>
  );
}

export default App;
