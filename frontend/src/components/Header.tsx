        // ابتدا عکس را import کنید
        import myLogo from '../assets/my-logo.png'; // مسیر نسبت به فایل فعلی

        function Header() {
          return (
            <header>
              <img src={myLogo} alt="My Company Logo" width="100" />
              {/* بقیه محتوای هدر */}
            </header>
          );
        }

        export default Header;
