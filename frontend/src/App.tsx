import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features'; // اضافه شد

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Features /> {/* اضافه شد */}
    </div>
  );
}

export default App;
