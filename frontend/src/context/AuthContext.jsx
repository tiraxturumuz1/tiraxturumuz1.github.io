import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchFromBackend } from '../services/PiService';

// ایجاد Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // اطلاعات کاربر (نام، آیدی و ...)
    const [isAuthenticated, setIsAuthenticated] = useState(false); // وضعیت ورود
    const [loading, setLoading] = useState(true); // وضعیت در حال بارگذاری

    // تابع ورود با استفاده از Pi SDK
    const login = async () => {
        try {
            setLoading(true);
            
            // ۱. فراخوانی متد احراز هویت شبکه Pi (این متد توسط Pi Browser ارائه می‌شود)
            // نکته: در محیط توسعه معمولی، این بخش ممکن است خطا بدهد چون Pi Browser نیست.
            const authResponse = await window.Pi.authenticate(
                import.meta.env.VITE_PI_APP_ID,
                { scope: ['username', 'user_id'] }
            );

            // ۲. ارسال اطلاعات دریافتی از Pi به بک‌اِند خودت برای تایید نهایی و ذخیره در دیتابیس
            const backendUser = await fetchFromBackend('/auth/pi-login', 'POST', {
                piUserId: authResponse.user.userId,
                piUsername: authResponse.user.username,
            });

            // ۳. ذخیره اطلاعات کاربر در State
            setUser(backendUser);
            setIsAuthenticated(true);
            
            console.log("✅ Login Successful:", backendUser);
        } catch (error) {
            console.error("❌ Login Failed:", error);
            alert("Login failed. Please use Pi Browser.");
        } finally {
            setLoading(false);
        }
    };

    // تابع خروج
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        // اگر نیاز به پاک کردن کوکی یا توکن در بک‌اِند بود، اینجا صدا زده می‌شود
    };

    // بررسی وضعیت کاربر در هنگام رفرش شدن صفحه (Check Session)
    useEffect(() => {
        const checkSession = async () => {
            try {
                // بررسی اینکه آیا کاربر قبلاً لاگین کرده و نشست (Session) معتبر دارد یا خیر
                const sessionData = await fetchFromBackend('/auth/me', 'GET');
                if (sessionData && sessionData.user) {
                    setUser(sessionData.user);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.log("No active session found.");
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook اختصاصی برای استفاده راحت از Auth در بقیه کامپوننت‌ها
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
