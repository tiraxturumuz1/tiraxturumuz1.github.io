// خواندن مقادیر از فایل .env به صورت امن
const PI_CONFIG = {
    clientId: import.meta.env.VITE_PI_CLIENT_ID,
    appId: import.meta.env.VITE_PI_APP_ID,
    backendUrl: import.meta.env.VITE_PI_BACKEND_URL,
    apiKey: import.meta.env.VITE_PI_API_KEY,
    multisigWallet: import.meta.env.VITE_PI_MULTISIG_WALLET
};

/**
 * بررسی اینکه آیا تمام متغیرهای محیطی بارگذاری شده‌اند یا خیر
 */
const validateConfig = () => {
    const missing = Object.keys(PI_CONFIG).filter(key => !PI_CONFIG[key]);
    if (missing.length > 0) {
        console.error(`⚠️ Missing Environment Variables: ${missing.join(', ')}`);
        console.warn("Make sure you have created a .env file in your root directory.");
        return false;
    }
    return true;
};

/**
 * تابع اصلی برای ارسال درخواست به بک‌اِند تو
 * این تابع API Key را در Header ارسال می‌کند تا بک‌اِند بفهمد درخواست معتبر است
 */
export const fetchFromBackend = async (endpoint, method = 'GET', body = null) => {
    if (!validateConfig()) throw new Error("Configuration Error");

    const url = `${PI_CONFIG.backendUrl}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': PI_CONFIG.apiKey // ارسال کلید به بک‌اِند برای تایید هویت
    };

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ PiDao API Error:", error.message);
        throw error;
    }
};

export { PI_CONFIG };
