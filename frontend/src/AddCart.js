import React, { useState } from 'react';
import axios from 'axios';

const AddToCart = () => {
  const [username, setUsername] = useState('');
  const [courseCid, setCourseCid] = useState('');

  const handleAddToCart = async () => {
    try {
      await axios.post('http://localhost:5000/add-to-cart', {
        username,
        courseCid,
      });
      alert('Course added to cart successfully');
    } catch (error) {
      console.error('Error adding course to cart:', error);
      alert('Failed to add course to cart');
    }
  };

  return (
    <div>
      <h2>Add Course to Cart</h2>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="text" placeholder="Course CID" value={courseCid} onChange={(e) => setCourseCid(e.target.value)} />
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
};

export default AddToCart;
