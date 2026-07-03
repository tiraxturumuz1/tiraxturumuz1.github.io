import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// کامپوننت‌های نمونه (بعداً این‌ها را از فایل‌های خودتان وارد می‌کنید)
const Home = () => <div style={{ padding: '20px' }}><h1>Welcome to Pi DAO</h1><p>Loading decentralized ecosystem...</p></div>;
const Login = () => <div style={{ padding: '20px' }}><h1>Pi Network Login</h1><p>Authenticating...</p></div>;

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* اینجا می‌توانید Header یا Navbar خود را اضافه کنید */}
        
        <Routes>
          {/* مسیر اصلی */}
          <Route path="/" element={<Home />} />
          
          {/* مسیر ورود */}
          <Route path="/login" element={<Login />} />
          
          {/* مسیر برای مدیریت خطای 404 */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
