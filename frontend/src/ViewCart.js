import React, { useState } from 'react';
import axios from 'axios';

const ViewCart = () => {
  const [username, setUsername] = useState('');
  const [cartItems, setCartItems] = useState([]);

  const handleViewCart = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/cart/${username}`);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      alert('Failed to fetch cart items');
    }
  };

  return (
    <div>
      <h2>View Cart</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <button onClick={handleViewCart}>View Cart</button>
      {cartItems.length > 0 && (
        <div>
          <h3>Cart Items</h3>
          {cartItems.map((item) => (
            <div key={item.id}>
              <p>Course CID: {item.courseCid}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewCart;
