import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome to Pi DAO</h1>
      <p>Your gateway to decentralized governance.</p>
      
      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <Link to="/tasks" style={buttonStyle}>
          View Engagement Tasks
        </Link>
        <Link to="/shop" style={buttonStyle}>
          Visit Pi Shop
        </Link>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '12px 24px',
  backgroundColor: '#673ab7', // رنگ بنفش نمادیک Pi
  color: 'white',
  textDecoration: 'none',
  borderRadius: '8px',
  fontWeight: 'bold'
};

export default Home;
