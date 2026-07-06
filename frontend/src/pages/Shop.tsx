import React, { useState } from 'react';
import PiService from '../services/PiService';

interface Product {
  id: number;
  name: string;
  price: number; // تغییر از string به number برای محاسبات
  priceDisplay: string; // برای نمایش زیبای "10 Pi"
  image: string;
  description: string;
}

const products: Product[] = [
  { 
    id: 1, 
    name: "Pi DAO Membership", 
    price: 10, 
    priceDisplay: "10 Pi", 
    image: "https://via.placeholder.com/150/673ab7/ffffff?text=Membership", 
    description: "Full access to DAO voting and governance" 
  },
  { 
    id: 2, 
    name: "Governance Token", 
    price: 50, 
    priceDisplay: "50 Pi", 
    image: "https://via.placeholder.com/150/ff9800/ffffff?text=Token", 
    description: "Premium governance weight" 
  },
];

const Shop: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState<number | null>(null); // ذخیره ID محصولی که در حال پرداخت است
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  const handlePurchase = async (product: Product) => {
    if (!window.Pi) {
      setStatusMsg({ type: 'error', text: 'Please use the Pi Browser to complete your purchase.' });
      return;
    }

    setIsProcessing(product.id);
    setStatusMsg({ type: 'info', text: `Preparing ${product.name}...` });

    try {
      // ۱. ایجاد تراکنش در بک‌اِند
      const initialPayment = await PiService.createPayment({
        amount: product.price,
        type: 'PRODUCT_PURCHASE',
        metadata: { productId: product.id, productName: product.name }
      });

      // ۲. شروع فرآیند پرداخت در Pi SDK
      const payment = await window.Pi.createPayment({
        amount: product.price,
        memo: `Purchase: ${product.name}`,
        metadata: {
          productId: product.id,
          orderId: initialPayment.orderId // استفاده از ID بک‌اِند برای تطبیق
        },
      });

      // ۳. تایید سرور (Server Approval)
      await window.Pi.onReadyForServerApproval(async (paymentId) => {
        try {
          await PiService.approvePayment(paymentId);

          // ۴. تکمیل نهایی (Completion)
          await window.Pi.onReadyForServerCompletion(async (paymentId, txid) => {
            try {
              await PiService.completePayment({
                paymentId,
                txid,
                amount: product.price,
                productId: product.id
              });

              setStatusMsg({ type: 'success', text: `Successfully purchased ${product.name}!` });
              setIsProcessing(null);
            } catch (err) {
              console.error("Completion Error:", err);
              setStatusMsg({ type: 'error', text: 'Payment completed but activation failed. Contact Admin.' });
              setIsProcessing(null);
            }
          });

        } catch (err) {
          console.error("Approval Error:", err);
          setStatusMsg({ type: 'error', text: 'Server approval failed.' });
          setIsProcessing(null);
        }
      });

    } catch (err: any) {
      console.error("Purchase Error:", err);
      setStatusMsg({ 
        type: 'error', 
        text: err.message || 'An error occurred. Please try again.' 
      });
      setIsProcessing(null);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Pi DAO Marketplace</h2>

      {statusMsg && (
        <div style={{ 
          ...bannerStyle, 
          backgroundColor: statusMsg.type === 'success' ? '#e8f5e9' : statusMsg.type === 'error' ? '#ffebee' : '#e3f2fd',
          color: statusMsg.type === 'success' ? '#2e7d32' : statusMsg.type === 'error' ? '#c62828' : '#1565c0'
        }}>
          {statusMsg.text}
        </div>
      )}

      <div style={gridStyle}>
        {products.map(product => (
          <div key={product.id} style={productCardStyle}>
            <img src={product.image} alt={product.name} style={imageStyle} />
            <div style={{ padding: '10px' }}>
              <h3 style={{ fontSize: '1.1rem', margin: '10px 0', minHeight: '2.5rem' }}>{product.name}</h3>
              <p style={{ fontSize: '0.85rem', color: '#666', minHeight: '3rem' }}>{product.description}</p>
              <p style={{ color: '#673ab7', fontWeight: 'bold', fontSize: '1.2rem', margin: '10px 0' }}>
                {product.priceDisplay}
              </p>
              
              <button 
                style={{ 
                  ...buyButtonStyle, 
                  backgroundColor: isProcessing === product.id ? '#ccc' : '#673ab7',
                  cursor: isProcessing === product.id ? 'not-allowed' : 'pointer'
                }}
                onClick={() => handlePurchase(product)}
                disabled={isProcessing !== null}
              >
                {isProcessing === product.id ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Styles ---

const containerStyle: React.CSSProperties = {
  padding: '20px',
  maxWidth: '1000px',
  margin: '0 auto',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '25px',
  marginTop: '20px',
};

const productCardStyle: React.CSSProperties = {
  border: '1px solid #eee',
  borderRadius: '16px',
  overflow: 'hidden',
  textAlign: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  backgroundColor: '#fff',
  transition: 'transform 0.2s ease',
};

const imageStyle: React.CSSProperties = {
  width: '100%',
  height: '150px',
  objectFit: 'cover',
};

const bannerStyle: React.CSSProperties = {
  padding: '12px',
  borderRadius: '8px',
  marginBottom: '20px',
  textAlign: 'center',
  fontSize: '0.9rem',
  fontWeight: '500',
};

const buyButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '1rem',
  transition: 'background-color 0.3s ease',
};

export default Shop;
