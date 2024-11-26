import React, { useState } from 'react';
import './App.css';

function App() {
  // State to store the message from the backend
  const [message, setMessage] = useState('');

  const publicUrl = 'https://fall2024-comp307-group06.cs.mcgill.ca/api';
  // const localhostUrl = 'http://10.140.17.106';

  // Function to fetch the message from the backend
  const fetchMessage = async () => {
    try {
      const response = await fetch(`${publicUrl}/message`);
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
    <div className="App">
      <button onClick={fetchMessage}>Click to print Hello World</button>
      <div>{message}</div>

    </div>
  );
}

export default App;
