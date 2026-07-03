## ⚙️ Setup & Installation

Follow these steps to get the development environment running on your local machine.

### 1. Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (Optional, for containerized deployment)

---

### 2. Frontend Setup (React + Vite)
The frontend is a Single Page Application (SPA) built with Vite.
```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install all necessary dependencies
npm install

# 3. Create a local .env file for development (if needed)
# cp .env.development .env.local

# 4. Start the development server
npm run dev
