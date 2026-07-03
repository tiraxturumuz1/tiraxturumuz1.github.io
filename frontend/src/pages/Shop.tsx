import React from 'react';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

const products: Product[] = [
  { id: 1, name: "Pi DAO Membership", price: "10 Pi", image: "https://via.placeholder.com/150" },
  { id: 2, name: "Governance Token", price: "50 Pi", image: "https://via.placeholder.com/150" },
];

const Shop: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Pi DAO Marketplace</h2>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
        gap: '20px',
        marginTop: '20px' 
      }}>
        {products.map(product => (
          <div key={product.id} style={productCardStyle}>
            <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '8px' }} />
            <h3 style={{ fontSize: '1rem', margin: '10px 0' }}>{product.name}</h3>
            <p style={{ color: '#673ab7', fontWeight: 'bold' }}>{product.price}</p>
            <button style={buyButtonStyle}>Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const productCardStyle = {
  border: '1px solid #eee',
  padding: '10px',
  borderRadius: '12px',
  textAlign: 'center',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
};

const buyButtonStyle = {
  width: '100%',
  padding: '8px',
  backgroundColor: '#000',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default Shop;

