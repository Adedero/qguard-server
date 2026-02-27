# Q-Guard Server 🛡️

> **Protecting the Community.** > The backend API for Q-Guard, a safety reporting and hotspot visualization tool for the queer community in Nigeria.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v18%2B-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## 📖 About

**Q-Guard** is a response to the prevalence of "Kito"—targeted assaults and entrapment of queer individuals in Nigeria. This backend service powers the Q-Guard platform, allowing users to:

1.  Securely log in and authenticate.
2.  Report incidents anonymously.
3.  Query geolocation data to identify high-risk areas ("Hotspots").

**⚠️ Privacy Note:** This repository contains sensitive logic regarding user anonymity. Please review the [Security Policy](#-security) before contributing.

## 🛠️ Tech Stack

- **Runtime:** Node.js (TypeScript)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Validation:** Zod
- **Authentication:** JWT / Argon2
- **Logging:** Winston

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL/MongoDB running locally or in the cloud
- npm or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/Adedero/q-guard-server.git](https://github.com/Adedero/q-guard-server.git)
    cd q-guard-server
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Environment Variables**
    Copy the example environment file and fill in your secrets.

    ```bash
    cp .env.example .env
    ```

    - `PORT`: Server port (default: 5000)
    - `DATABASE_URL`: Connection string
    - `JWT_SECRET`: Secret key for signing tokens
    - `NODE_ENV`: development/production
    - ...

4.  **Run the server**

    ```bash
    # Development mode (watch)
    npm run dev

    # Production build
    npm run build
    npm start
    ```

## 🔌 API Endpoints

| Method | Endpoint               | Description               |
| :----- | :--------------------- | :------------------------ |
| `POST` | `/api/v1/auth/sign-up` | Create a new user account |
| `POST` | `/api/v1/auth/sign-in` | Authenticate user         |

> _Full API documentation is available at `/api-docs` when running in development mode._

## 🧪 Testing

We use **Jest** for unit and integration testing.

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

## 🔒 Security

If you discover a security vulnerability within Q-Guard, please send an e-mail to security@qguard.org instead of creating a public issue. We take data privacy extremely seriously.
