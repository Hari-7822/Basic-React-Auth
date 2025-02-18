import React, { useState } from 'react';
import axios from 'axios';

const GetUserDetails = () => {
  const [username, setUsername] = useState('');
  const [userDetails, setUserDetails] = useState(null);

  const handleGetUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${username}`);
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Failed to fetch user details');
    }
  };

  return (
    <div>
      <h2>Get User Details</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={handleGetUserDetails}>Get User Details</button>
      {userDetails && (
        <div>
          <h3>User Details</h3>
          <p>Name: {userDetails.name}</p>
          <p>Username: {userDetails.username}</p>
          <p>Email: {userDetails.email}</p>
        </div>
      )}
    </div>
  );
};

export default GetUserDetails;
