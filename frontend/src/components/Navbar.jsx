import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, isAuthenticated, login, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="logo">PiDao</div>
            
            <div className="nav-links">
                <a href="#features">Features</a>
                <a href="#about">About</a>
                
                {/* اگر کاربر لاگین نکرده بود، دکمه Login را نشان بده */}
                {!isAuthenticated ? (
                    <button className="btn-login" onClick={login}>
                        Login with Pi
                    </button>
                ) : (
                    /* اگر کاربر لاگین کرده بود، نام او و دکمه Logout را نشان بده */
                    <div className="user-menu">
                        <span className="username">@{user?.username || 'User'}</span>
                        <button className="btn-logout" onClick={logout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
