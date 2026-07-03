import React from 'react';

const Success = ({ transactionId, onReset }) => {
  const styles = {
    container: {
      textAlign: 'center',
      padding: '50px 20px',
      fontFamily: 'Tahoma, sans-serif',
      direction: 'rtl'
    },
    icon: {
      fontSize: '80px',
      color: '#28a745',
      marginBottom: '20px'
    },
    title: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '10px'
    },
    text: {
      fontSize: '18px',
      color: '#666',
      marginBottom: '30px'
    },
    card: {
      backgroundColor: '#fff',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      maxWidth: '400px',
      margin: '0 auto'
    },
    txId: {
      fontSize: '14px',
      color: '#999',
      wordBreak: 'break-all',
      backgroundColor: '#f8f9fa',
      padding: '10px',
      borderRadius: '5px',
      marginTop: '10px'
    },
    button: {
      padding: '12px 30px',
      fontSize: '16px',
      backgroundColor: '#4A90E2',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      marginTop: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>✅</div>
        <h2 style={styles.title}>پرداخت موفقیت‌آمیز بود!</h2>
        <p style={styles.text}>تراکنش شما با موفقیت در شبکه ثبت شد.</p>
        
        <div style={styles.txId}>
          <strong>شناسه تراکنش:</strong><br/>
          {transactionId || 'در حال پردازش...'}
        </div>

        <button 
          style={styles.button} 
          onClick={onReset}
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    </div>
  );
};

export default Success;
