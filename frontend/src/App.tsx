import React from 'react';
import './index.css'; // حتماً این خط را اضافه کن تا استایل‌های کلی اعمال شوند
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Poll from './components/Poll';
import Footer from './components/Footer'; // اضافه شد

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Features />
      <Poll />
      <Footer /> {/* اضافه شد */}
    </div>
  );
}

export default App;
