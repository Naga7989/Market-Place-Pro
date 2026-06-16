# 🛒 MarketPlace Pro — Enterprise Multi-Vendor Marketplace Platform

<p align="center">
  <img src="docs/assets/banner.png" alt="MarketPlace Pro" width="100%" />
</p>

<p align="center">
  <strong>A production-ready enterprise-scale multi-vendor e-commerce and services marketplace platform</strong><br/>
  Combining Amazon-style e-commerce • Urban Company services • Fiverr freelancers
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=java" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.2-green?style=flat-square&logo=spring" />
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/MySQL-8.0-blue?style=flat-square&logo=mysql" />
  <img src="https://img.shields.io/badge/Redis-7-red?style=flat-square&logo=redis" />
  <img src="https://img.shields.io/badge/Elasticsearch-8.x-yellow?style=flat-square&logo=elasticsearch" />
  <img src="https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker" />
  <img src="https://img.shields.io/badge/Kubernetes-EKS-326CE5?style=flat-square&logo=kubernetes" />
</p>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Architecture](#architecture)

---

## 🌟 Overview

MarketPlace Pro is a comprehensive, enterprise-grade marketplace platform that brings together:

| Platform Type | Inspiration | Features |
|---|---|---|
| **E-Commerce** | Amazon/Flipkart | Multi-vendor products, inventory, logistics |
| **Service Marketplace** | Urban Company | Home services, beauty, healthcare, bookings |
| **Freelancer Platform** | Fiverr/Upwork | Project posting, proposals, milestone payments |
| **Local Services** | JustDial | Local service provider discovery |

---

## ✨ Features

### 👥 User Roles
- **Customer** — Browse, buy, book services, hire freelancers
- **Seller/Vendor** — List products, manage inventory, track orders
- **Service Provider** — Offer services, manage bookings & calendar
- **Freelancer** — Create profiles, bid on projects, deliver work
- **Delivery Partner** — Accept assignments, track deliveries, earn
- **Vendor Manager** — Oversee vendor onboarding & operations
- **Admin** — Platform management, analytics, moderation
- **Super Admin** — System configuration, security, audit logs

### 🛍️ E-Commerce
- Unlimited categories & subcategories
- Product variants (color, size, material)
- Bulk CSV product upload
- Inventory management & alerts
- Flash sales with countdown timers
- Product comparison
- Wishlist & cart
- Multiple delivery addresses

### 🔧 Service Marketplace
- **Home Services**: Plumbing, Electrician, Cleaning, Painting, Carpentry
- **Beauty**: Salon, Makeup, Grooming
- **Education**: Tutors, Online Coaching, Skill Training
- **Healthcare**: Doctor Consultation, Nursing
- **Vehicle**: Repair, Maintenance, Washing
- **Business**: Accounting, Legal, Consulting
- **Events**: Photography, Catering, Decoration

### 💼 Freelancer Marketplace
- Rich freelancer profiles & portfolios
- Project posting with budget & skills requirements
- Bidding & proposal system
- Milestone-based payments
- Ratings & reviews

### 💳 Payments (India-First)
- **Razorpay** — Cards, Net Banking, UPI
- **UPI** — Google Pay, PhonePe, Paytm
- **Wallet** — Platform digital wallet
- **Cash on Delivery** — For physical products
- Automatic commission deduction
- Instant refunds

### 🤖 AI Features (Google Gemini)
- AI chatbot for customer support
- Personalized product/service recommendations
- Smart search with semantic understanding
- AI-generated product descriptions (for vendors)

### 🔒 Security
- JWT + Refresh Token authentication
- Google OAuth 2.0
- Mobile OTP via Twilio
- Role-Based Access Control (RBAC)
- API rate limiting (Bucket4j)
- Audit logging
- bcrypt password hashing

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Java | 21 | Core language |
| Spring Boot | 3.2.x | Application framework |
| Spring Security | 6.x | Auth & authorization |
| Spring Data JPA | 3.x | Database ORM |
| Hibernate | 6.x | JPA implementation |
| Maven | 3.9 | Build tool |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15.x | React framework |
| React | 18.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| ShadCN UI | Latest | Component library |
| Framer Motion | 11.x | Animations |
| Redux Toolkit | 2.x | State management |
| TanStack Query | 5.x | Server state |

### Infrastructure
| Technology | Purpose |
|---|---|
| MySQL 8.0 | Primary database |
| Redis 7 | Caching & sessions |
| Elasticsearch 8 | Full-text search |
| AWS S3 | File storage |
| Docker | Containerization |
| Kubernetes (EKS) | Orchestration |
| Nginx | Reverse proxy |
| Flyway | DB migrations |

### Third-Party Services
| Service | Purpose |
|---|---|
| Razorpay | Payment processing |
| Twilio | SMS OTP |
| Google OAuth | Social login |
| Google Gemini AI | AI features |
| AWS SES/SMTP | Email |

---

## 📁 Project Structure

```
marketplace/
├── backend/                    # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/marketplace/
│   │   │   │   ├── config/          # App configs (Redis, ES, Security, CORS)
│   │   │   │   ├── controller/      # REST Controllers
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   │   ├── request/     # Request DTOs
│   │   │   │   │   └── response/    # Response DTOs
│   │   │   │   ├── entity/          # JPA Entities
│   │   │   │   ├── enums/           # Enum definitions
│   │   │   │   ├── exception/       # Custom exceptions
│   │   │   │   ├── filter/          # JWT & rate limit filters
│   │   │   │   ├── repository/      # JPA Repositories
│   │   │   │   ├── security/        # Security services
│   │   │   │   ├── service/         # Business logic
│   │   │   │   └── util/            # Utilities
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── application-dev.yml
│   │   │       ├── application-prod.yml
│   │   │       └── db/migration/    # Flyway SQL migrations
│   │   └── test/                    # Unit & integration tests
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                   # Next.js Application
│   ├── src/
│   │   ├── app/                # App Router pages
│   │   │   ├── (auth)/         # Auth pages
│   │   │   ├── (customer)/     # Customer pages
│   │   │   ├── (vendor)/       # Vendor dashboard
│   │   │   ├── (provider)/     # Service provider dashboard
│   │   │   ├── (freelancer)/   # Freelancer dashboard
│   │   │   ├── (delivery)/     # Delivery partner
│   │   │   └── (admin)/        # Admin & Super Admin
│   │   ├── components/         # React components
│   │   │   ├── layout/         # Header, Footer, Sidebar
│   │   │   ├── product/        # Product components
│   │   │   ├── service/        # Service components
│   │   │   ├── freelancer/     # Freelancer components
│   │   │   ├── cart/           # Cart components
│   │   │   ├── dashboard/      # Dashboard components
│   │   │   ├── chat/           # Chat components
│   │   │   └── ui/             # Shared UI components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # API client, utilities
│   │   ├── store/              # Redux store
│   │   ├── types/              # TypeScript types
│   │   └── middleware.ts       # Next.js middleware
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── Dockerfile
│
├── database/
│   ├── schema.sql              # Complete MySQL schema
│   ├── V1__initial_schema.sql  # Flyway migration
│   └── V2__seed_data.sql       # Sample data
│
├── docker/
│   ├── docker-compose.yml      # Local development
│   ├── docker-compose.prod.yml # Production
│   └── nginx/
│       └── nginx.conf
│
├── k8s/                        # Kubernetes manifests
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   ├── mysql-statefulset.yaml
│   ├── redis-deployment.yaml
│   ├── elasticsearch-statefulset.yaml
│   └── ingress.yaml
│
└── docs/
    ├── ARCHITECTURE.md
    ├── DEPLOYMENT.md
    └── API.md
```

---

## 🚀 Quick Start

### Prerequisites
- Docker Desktop 4.x+
- Node.js 20+ (for local frontend dev)
- Java 21+ (for local backend dev)
- Maven 3.9+

### 1. Clone & Configure
```bash
git clone https://github.com/your-org/marketplace.git
cd marketplace
cp .env.example .env
# Edit .env with your API keys
```

### 2. Start with Docker Compose
```bash
docker-compose -f docker/docker-compose.yml up -d
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **Kibana**: http://localhost:5601
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

### 3. Local Development

**Backend:**
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the root:

```bash
# ============ DATABASE ============
MYSQL_URL=jdbc:mysql://localhost:3306/marketplace_db?useSSL=false&serverTimezone=Asia/Kolkata
MYSQL_USER=marketplace_user
MYSQL_PASSWORD=your_secure_password
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=marketplace_db

# ============ REDIS ============
REDIS_HOST=localhost
REDIS_PORT=6379

# ============ ELASTICSEARCH ============
ES_URL=http://localhost:9200

# ============ JWT ============
JWT_SECRET=your-256-bit-secret-replace-in-production-minimum-64-chars

# ============ RAZORPAY ============
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id

# ============ TWILIO (OTP) ============
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=+1234567890

# ============ GOOGLE OAUTH ============
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# ============ GEMINI AI ============
GEMINI_API_KEY=your_gemini_api_key

# ============ AWS S3 ============
AWS_ACCESS_KEY=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_S3_BUCKET=marketplace-uploads
AWS_REGION=ap-south-1

# ============ SMTP EMAIL ============
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# ============ FRONTEND ============
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 📖 API Documentation

Once running, access **Swagger UI** at:
```
http://localhost:8080/api/swagger-ui.html
```

OpenAPI JSON spec:
```
http://localhost:8080/api/v3/api-docs
```

### Key API Groups
| Group | Base Path | Auth Required |
|---|---|---|
| Authentication | `/api/auth` | No |
| Products | `/api/products` | No (read), Yes (write) |
| Categories | `/api/categories` | No |
| Cart & Wishlist | `/api/cart`, `/api/wishlist` | Yes |
| Orders | `/api/orders` | Yes |
| Services | `/api/services/public` | No (browse), Yes (book) |
| Bookings | `/api/bookings` | Yes |
| Freelancers | `/api/freelancers` | No (browse), Yes (hire) |
| Projects | `/api/projects` | Yes |
| Payments | `/api/payments` | Yes |
| Vendor | `/api/vendors` | Yes (SELLER role) |
| Admin | `/api/admin` | Yes (ADMIN role) |
| Super Admin | `/api/super-admin` | Yes (SUPER_ADMIN role) |

---

## 🚢 Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete deployment guide.

**Quick Production Deploy to AWS EKS:**
```bash
# Build images
docker build -t marketplace-backend ./backend
docker build -t marketplace-frontend ./frontend

# Push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URI
docker tag marketplace-backend:latest $ECR_URI/marketplace-backend:latest
docker push $ECR_URI/marketplace-backend:latest

# Deploy to EKS
kubectl apply -f k8s/
```

---

## 🏗️ Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

```
                    ┌─────────────────────────────────────────┐
                    │              AWS Cloud (EKS)             │
                    │                                          │
     Users ────────►│  Ingress (Nginx + TLS)                  │
                    │      │              │                    │
                    │  Next.js 15    Spring Boot 3             │
                    │  (3 pods)      (3-10 pods HPA)           │
                    │                    │                     │
                    │         ┌──────────┼──────────┐          │
                    │      MySQL 8   Redis 7   Elasticsearch   │
                    │       (RDS)    (ElastiCache)  (OpenSearch)│
                    │                    │                     │
                    │              AWS S3 (Files)              │
                    └─────────────────────────────────────────┘
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## 🆘 Support

- 📧 Email: support@marketplace.example.com
- 💬 Discord: discord.gg/marketplace
- 📖 Docs: docs.marketplace.example.com

---

<p align="center">
  Built with ❤️ for the Indian marketplace ecosystem
</p>
