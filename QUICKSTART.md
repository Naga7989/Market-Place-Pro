# MarketPlace Pro — Quick Start Guide

## Prerequisites

Make sure you have installed:
- **Java 21** (JDK)
- **Node.js 20+** with npm
- **MySQL 8**
- **Redis** (optional for dev, caching disabled automatically)
- **Maven 3.9+**

---

## 1. Database Setup

```sql
-- Create database and user
CREATE DATABASE marketplace_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'marketplace_user'@'localhost' IDENTIFIED BY 'marketplace_pass';
GRANT ALL PRIVILEGES ON marketplace_db.* TO 'marketplace_user'@'localhost';
FLUSH PRIVILEGES;
```

Run the seed data (optional, roles + categories):
```bash
mysql -u marketplace_user -p marketplace_db < database/V2__seed_data.sql
```

---

## 2. Backend Setup

### Configure environment
Copy and fill in your API keys:
```bash
cp .env.example .env
```

Key values to set in `.env` (or `backend/src/main/resources/application.yml`):
| Variable | Description |
|---|---|
| `DB_HOST` | MySQL host (default: localhost) |
| `DB_PASSWORD` | Your MySQL password |
| `JWT_SECRET` | Min 256-bit random string |
| `RAZORPAY_KEY_ID` | From Razorpay Dashboard |
| `RAZORPAY_KEY_SECRET` | From Razorpay Dashboard |
| `TWILIO_ACCOUNT_SID` | For OTP SMS (optional in dev) |
| `GOOGLE_CLIENT_ID` | For Google OAuth |
| `GEMINI_API_KEY` | Google Gemini AI |
| `SMTP_USERNAME` | Gmail/SMTP for emails |

### Run backend
```bash
cd backend
mvn spring-boot:run
```

The backend starts at **http://localhost:8080**
API Docs: **http://localhost:8080/swagger-ui.html**

---

## 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

Run frontend:
```bash
npm run dev
```

Frontend starts at **http://localhost:3000**

---

## 4. Default Accounts (after seed data)

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@marketplace.in | Admin@123! |

---

## 5. Architecture Overview

```
marketplace/
├── backend/           # Spring Boot 3 + Java 21
│   └── src/main/java/com/marketplace/
│       ├── entity/        # 56 JPA entities
│       ├── repository/    # Spring Data repositories
│       ├── service/       # Business logic
│       ├── controller/    # REST API controllers  
│       ├── security/      # JWT + Spring Security
│       ├── config/        # Redis, WebSocket, OpenAPI
│       └── exception/     # Custom exceptions + handler
├── frontend/          # Next.js 15 + TypeScript
│   └── src/
│       ├── app/           # App Router pages
│       │   ├── (auth)/    # Login, Register
│       │   ├── (customer)/ # Homepage, Products, Cart
│       │   └── (vendor)/  # Vendor Dashboard
│       ├── components/    # Reusable UI components
│       ├── lib/           # API client, utilities
│       └── store/         # Redux Toolkit store
└── database/          # SQL schemas and migrations
    ├── schema.sql        # Full MySQL schema (40+ tables)
    ├── V1__initial_schema.sql  # Flyway migration
    └── V2__seed_data.sql      # Roles, categories, admin
```

## 6. Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register new account |
| POST | `/api/v1/auth/login` | Email + password login |
| POST | `/api/v1/auth/otp/send` | Send OTP to mobile |
| POST | `/api/v1/auth/otp/verify` | Login with OTP |
| GET | `/api/v1/products` | List products |
| GET | `/api/v1/products/search?q=` | Search products |
| GET | `/api/v1/categories` | Get categories |
| POST | `/api/v1/cart/items` | Add to cart |
| POST | `/api/v1/orders` | Place order |
| POST | `/api/v1/payments/razorpay/create/{orderId}` | Create Razorpay payment |
| POST | `/api/v1/payments/razorpay/verify` | Verify payment |
| GET | `/api/v1/services/public` | List services |
| POST | `/api/v1/services/book` | Book a service |
| GET | `/api/v1/freelancers` | List freelancers |
| GET | `/api/v1/projects` | List open projects |
| POST | `/api/v1/projects` | Post a project |

---

## 7. Razorpay Integration

The payment flow:
1. Frontend: `POST /payments/razorpay/create/{orderId}` → get `razorpay_order_id`
2. Frontend: Open Razorpay checkout with key
3. On success: `POST /payments/razorpay/verify` with signature
4. Backend verifies HMAC-SHA256 and marks order as PAID

For webhook events, configure `https://yourdomain.com/api/v1/payments/razorpay/webhook` in Razorpay Dashboard.

---

## 8. Setting the Workspace

To set this as your active workspace in Antigravity:
```
Workspace path: C:\Users\snaga\.gemini\antigravity\scratch\marketplace
```
