import React from 'react';
import Navbar from './components/Navbar';
import Payment from './components/Payment';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      
      <main className="main-content">
        <section className="hero">
          <h1>Welcome to PiDao</h1>
          <p>The future of decentralized governance on the Pi Network.</p>
        </section>

        <section className="features">
          {/* اینجا میتوانی کامپوننت‌های ویژگی‌ها را اضافه کنی */}
        </section>

        <section className="action-section">
          <Payment />
        </section>
      </main>

      <footer>
        <p>&copy; 2026 PiDao Project. Built with React & Pi Network.</p>
      </footer>
    </div>
  );
}

export default App;
