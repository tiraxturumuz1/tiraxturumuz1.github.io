import React, { useEffect, useState } from 'react';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // دریافت اطلاعات از بک‌اِند
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // نکته: برای تست، ما مستقیم به مسیر ادمین درخواست می‌زنیم
        // در آینده این مسیر باید با توکن کاربر امن شود
        const response = await fetch('http://localhost:5000/api/admin/transactions');
        const data = await response.json();

        if (data.success) {
          setTransactions(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('خطا در اتصال به سرور. مطمئن شوید بک‌اِند روشن است.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <div style={styles.center}>در حال بارگذاری...</div>;
  if (error) return <div style={{...styles.center, color: 'red'}}>{error}</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📜 تاریخچه تراکنش‌های PiDao</h2>
      
      {transactions.length === 0 ? (
        <p style={styles.center}>هنوز هیچ تراکنشی ثبت نشده است.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>ID تراکنش</th>
                <th style={styles.th}>مبلغ</th>
                <th style={styles.th}>محصول</th>
                <th style={styles.th}>وضعیت</th>
                <th style={styles.th}>تاریخ</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} style={styles.tableRow}>
                  <td style={styles.td}>{tx.piTransactionId.substring(0, 10)}...</td>
                  <td style={styles.td}>{tx.amount} {tx.currency}</td>
                  <td style={styles.td}>{tx.metadata.productName}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.status, 
                      backgroundColor: tx.status === 'completed' ? '#d4edda' : '#f8d7da',
                      color: tx.status === 'completed' ? '#155724' : '#721c24'
                    }}>
                      {tx.status === 'completed' ? 'موفق' : 'ناموفق'}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(tx.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// استایل‌های ساده برای زیبایی (بدون نیاز به فایل CSS جداگانه)
const styles = {
  container: { padding: '20px', fontFamily: 'Tahoma, sans-serif', direction: 'rtl' },
  title: { textAlign: 'center', color: '#333' },
  center: { textAlign: 'center', marginTop: '50px' },
  tableWrapper: { overflowX: 'auto', marginTop: '20px' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 0 20px rgba(0,0,0,0.1)' },
  tableHeader: { backgroundColor: '#4A90E2', color: '#fff' },
  th: { padding: '12px', textAlign: 'center' },
  td: { padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee' },
  tableRow: { transition: 'background 0.3s' },
  status: { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }
};

export default History;
