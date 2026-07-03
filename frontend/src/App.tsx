import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      {/* اینجا می‌توانید بخش‌های دیگر سایت را اضافه کنید */}
    </div>
  );
}

export default App;
