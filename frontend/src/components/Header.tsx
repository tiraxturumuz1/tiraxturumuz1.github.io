import React from 'react';
// اگر عکس وجود ندارد، این خط را کامنت کنید تا صفحه سفید نشود
// import myLogo from '../assets/my-logo.png'; 

const Header = () => {
  return (
    <header className="main-header">
      {/* اگر عکس ندارید، فعلاً یک متن بگذارید تا خطا رفع شود */}
      <div className="logo-placeholder">PiDao</div>
      {/* <img src={myLogo} alt="Logo" width="100" /> */}
    </header>
  );
};

export default Header;
