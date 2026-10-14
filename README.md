# 💎 Shoaib Jewellers

A modern, production-ready full-stack ecommerce platform for Shoaib Jewellers — a heritage Pakistani jewellery brand established in 1985.

Built with Next.js, React, Tailwind CSS, MySQL, and a modular architecture designed for a premium jewellery shopping experience and complete admin management.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Brand & Contact](#-brand--contact)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Features](#-features)
- [Customer Journey](#-customer-journey)
- [Admin Dashboard](#-admin-dashboard)
- [Component Design System](#-component-design-system)
- [Route Groups](#-route-groups)
- [API Endpoints](#-api-endpoints)
- [Performance & Best Practices](#-performance--best-practices)
- [Contributing](#-contributing)

---

## 🎯 Overview

**Shoaib Jewellers** is a full-stack ecommerce platform built for a heritage Pakistani jewellery brand operating since 1985.

The platform provides:

- A premium public jewellery storefront
- Product browsing and filtering
- Product detail pages
- Shopping cart and wishlist
- Customer authentication
- Checkout and Cash on Delivery
- Customer accounts and order history
- Journal/blog functionality
- Contact and customer communication
- A complete admin dashboard
- Product, category, order, customer, and content management

The architecture follows a **Domain-Driven Layout strategy** using Next.js Route Groups, separating the public `(website)` experience from the authenticated `(dashboard)` application.

---

## 💎 Brand & Contact

| | |
|---|---|
| **Business Name** | Shoaib Jewellers |
| **Established** | 1985 |
| **Address** | Shop No. 2, Al-Fazal Market, Madina Road, Township, Lahore, Pakistan |
| **Appointments** | [+92 306 430 3939](tel:+923064303939) |
| **Stock Pictures** | [+92 306 279 8888](tel:+923062798888) |
| **Email** | info@shoaibjewellers.pk |
| **Hours** | Mon – Sat: 10:00 AM – 8:00 PM · Sunday: Closed |
| **Tagline** | *Crafted to be worn for a lifetime.* |

### Collections

- **Gold** — 22K & 18K handcrafted pieces
- **Silver** — Sterling silver 925
- **Diamond** — Certified solitaires & clusters

---

## 🏗 Architecture

This project follows a strict separation of concerns. Every folder has a clear responsibility, making the codebase predictable and easy to maintain.

### Key Architectural Decisions

| Decision | Rationale |
|---|---|
| **Route Groups** | Separates `(website)` and `(dashboard)` without polluting URLs |
| **Raw SQL over ORM** | Direct `mysql2` queries through `lib/db.js` for performance and clarity |
| **Atomic Component Folders** | Components are grouped by responsibility rather than page |
| **Modular Context Providers** | Auth, Cart, Wishlist, Dashboard, Toast, and Theme state without prop drilling |
| **Custom Hooks** | Data fetching and reusable business logic lives in `hooks/` |
| **JWT Sessions** | Cookie-based authentication using `jose` |
| **Image Uploads** | Multipart image uploads handled with Formidable |

---

## 📂 Project Structure

```text
ShoaibJewellers/
├── README.md
├── database/
│   ├── schema.sql                 # Full MySQL schema
│   ├── seed.sql                   # Sample data
│   └── setup.js                   # Database setup script
│
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
│
├── public/
│   ├── images/                    # Category/header images
│   │   ├── menproductheader.png
│   │   └── womenproductheader.png
│   └── uploads/                   # Runtime uploaded images
│       ├── categories/
│       ├── products/
│       └── blog/
│
└── src/
    ├── app/
    │   ├── (dashboard)/           # 🔒 Admin application
    │   │   ├── dashboard/
    │   │   │   ├── blog/
    │   │   │   ├── categories/
    │   │   │   ├── customers/
    │   │   │   ├── messages/
    │   │   │   ├── orders/
    │   │   │   ├── products/
    │   │   │   └── page.jsx
    │   │   └── layout.jsx
    │   │
    │   ├── (website)/             # 🌐 Public storefront
    │   │   ├── about/
    │   │   ├── blog/
    │   │   ├── cart/
    │   │   ├── collections/
    │   │   ├── contact/
    │   │   ├── login/
    │   │   ├── products/
    │   │   ├── register/
    │   │   ├── services/
    │   │   ├── wishlist/
    │   │   ├── page.jsx
    │   │   └── layout.jsx
    │   │
    │   ├── api/                   # 🔌 Backend API
    │   │   ├── auth/
    │   │   ├── blog/
    │   │   ├── cart/
    │   │   ├── categories/
    │   │   ├── collections/
    │   │   ├── contact/
    │   │   ├── dashboard/
    │   │   ├── orders/
    │   │   ├── products/
    │   │   ├── uploads/
    │   │   ├── users/
    │   │   └── wishlist/
    │   │
    │   ├── favicon.ico
    │   ├── globals.css
    │   └── layout.jsx
    │
    ├── components/
    │   ├── animations/             # Framer Motion wrappers
    │   ├── cards/                  # Reusable cards
    │   ├── charts/                 # Recharts components
    │   ├── common/                 # Atomic UI components
    │   ├── dashboard/              # Admin-specific components
    │   ├── layout/                 # Navbar, Footer, Sidebar, Headers
    │   ├── media/                  # Media components
    │   ├── products/               # Product components
    │   ├── sections/               # Homepage sections
    │   └── tables/                 # Data table components
    │
    ├── context/
    │   ├── AuthContext.jsx
    │   ├── CartContext.jsx
    │   ├── DashboardContext.jsx
    │   ├── ThemeContext.jsx
    │   ├── ToastContext.jsx
    │   └── WishlistContext.jsx
    │
    ├── hooks/
    │   ├── useAuth.js
    │   ├── useDashboard.js
    │   └── useFetch.js
    │
    ├── lib/
    │   ├── api-response.js
    │   ├── auth.js
    │   ├── axios.js
    │   ├── collections.js
    │   ├── constants.js
    │   ├── contact.js
    │   ├── db.js
    │   ├── helpers.js
    │   ├── jwt.js
    │   ├── theme.js
    │   └── validation.js
    │
    └── middleware.js
```

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router) | `^16.2.10` |
| **UI Library** | React | `19.2.7` |
| **Styling** | Tailwind CSS | `^4.3.2` |
| **Database** | MySQL | `8.0+` |
| **DB Client** | mysql2 | `^3.24.4` |
| **Authentication** | jose + bcryptjs | `^6.2` / `^3.0` |
| **Animations** | Framer Motion | `^12.43.0` |
| **Animations** | GSAP + @gsap/react | `^3.15.0` |
| **Charts** | Recharts | `^3.9.2` |
| **Icons** | Lucide React | `^0.564.0` |
| **HTTP Client** | Axios | `^1.20.0` |
| **File Uploads** | Formidable | `^3.5.4` |
| **Data Fetching** | TanStack Query | `^5.103.2` |
| **Utilities** | tailwind-merge | `^3.6.0` |
| **Linting** | ESLint + eslint-config-next | `^9` / `^16.2.10` |

---

## 🗄 Database Schema

The MySQL database `shoaib_jewellers` contains 13 tables:

| Table | Purpose |
|---|---|
| `users` | Admin and customer accounts with role/status |
| `categories` | Hierarchical product categories |
| `products` | Product catalogue, pricing, stock, and attributes |
| `product_images` | Multiple product images with primary/sort support |
| `addresses` | Saved customer shipping addresses |
| `orders` | Order headers and shipping snapshots |
| `order_items` | Order line items with product snapshots |
| `cart_items` | Persistent customer cart |
| `wishlist_items` | Saved customer products |
| `site_settings` | Global site configuration |
| `inventory_logs` | Stock movement audit trail |
| `blog_posts` | Journal/blog content |
| `contact_messages` | Contact form submissions |

### Database Setup

```bash
# Import schema
mysql -u root -p < database/schema.sql

# Import seed data
mysql -u root -p shoaib_jewellers < database/seed.sql

# Or use the setup script
npm run db:setup
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **MySQL** 8.0+
- **npm** / **pnpm** / **yarn**

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>

# 2. Navigate into the project
cd ShoaibJewellers

# 3. Install dependencies
npm install

# 4. Configure environment variables
# Create .env.local and add your database credentials

# 5. Set up the database
npm run db:setup

# 6. Start the development server
npm run dev
```

Your store will be running at:

```text
http://localhost:3000
```

Admin dashboard:

```text
http://localhost:3000/dashboard
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=shoaib_jewellers

# Authentication
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD=100000
NEXT_PUBLIC_SHIPPING_FEE=250
```

---

## 📜 Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start development server |
| `build` | `npm run build` | Build for production |
| `start` | `npm run start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |
| `db:setup` | `npm run db:setup` | Import schema and seed data |

---

## ✨ Features

### 🌐 Website — Public Routes

- **Home** — Hero, Featured Collections, Featured Products, Craftsmanship, About, Testimonials, Journal, CTA
- **Collections** — Gold, Silver, and Diamond collections
- **Products** — All, Women, and Men with filtering, sorting, and search
- **Product Detail** — Image gallery, attributes, related products, cart, and wishlist
- **Cart** — Persistent cart with quantity controls and totals
- **Checkout** — Customer address and Cash on Delivery
- **Wishlist** — Save products for later
- **Journal** — Blog listing and individual posts
- **About** — Brand heritage and story
- **Contact** — WhatsApp, phone, email, and contact form
- **Authentication** — Login and registration
- **Account** — Orders, addresses, and profile

### 🔒 Dashboard — Authenticated Routes

- **Overview** — Revenue, orders, products, customers, alerts, and recent activity
- **Orders** — Filtering, status updates, cancellation, and stock restoration
- **Products** — Create, update, delete, multi-image uploads, draft/publish, and featured products
- **Categories** — Hierarchical categories, gender, and images
- **Customers** — Customer management, order history, addresses, and lifetime spend
- **Messages** — Contact inbox and message status workflow
- **Journal** — Blog CRUD with markdown content and cover images
- **Analytics** — Revenue charts and sales by category

### 🎨 UI & UX

- Premium jewellery design language
- Warm cream and gold visual palette
- Serif display typography
- Smooth Framer Motion animations
- Responsive mobile-first design
- Reusable component system
- Recharts data visualization
- Floating WhatsApp customer support button
- Light-only storefront theme

---

## 🛍 Customer Journey

```text
Home
  ↓
Collections / Products
  ↓
Product Detail
  ↓
Add to Cart
  ↓
Cart
  ↓
Checkout
  ↓
Order Confirmation
  ↓
My Account
  ↓
Order History
```

### Key Touchpoints

1. **Discovery** — Hero → Collections → Featured Products
2. **Browsing** — Filter by category, gender, price, and sorting
3. **Consideration** — Product details, materials, weight, size, and stone information
4. **Purchase** — Cart → Checkout → Cash on Delivery
5. **Post-purchase** — Order history and tracking
6. **Support** — WhatsApp and contact form

---

## 🎛 Admin Dashboard

Access the admin panel at:

```text
/dashboard
```

Admin access requires `role = 'admin'` in the `users` table.

| Section | Capabilities |
|---|---|
| **Overview** | Real-time stats, alerts, pending orders, and low-stock products |
| **Orders** | Order status workflow and stock management |
| **Products** | Jewellery attributes, pricing, stock, images, and publishing |
| **Categories** | Parent/child hierarchy and gender-specific collections |
| **Customers** | Customer details, order history, addresses, and lifetime spend |
| **Messages** | Contact message workflow |
| **Journal** | Markdown content and draft/publish workflow |
| **Analytics** | Revenue and category sales charts |

### Order Status Workflow

```text
pending
   ↓
confirmed
   ↓
processing
   ↓
shipped
   ↓
delivered
```

---

## 🧩 Component Design System

Components are organized by **Atomic Responsibility**:

| Folder | Responsibility | Examples |
|---|---|---|
| `common/` | **Atoms** — Reusable UI primitives | Button, Input, Badge, Modal |
| `cards/` | **Molecules** — Composite components | FeatureCard, ProductCard, StatsCard |
| `sections/` | **Organisms** — Homepage sections | HeroSection, CTASection |
| `layout/` | **Templates** — Layout shells | Navbar, Sidebar, Footer |
| `products/` | **Domain** — Product components | ProductCard, ProductGrid |
| `dashboard/` | **Domain** — Admin features | AnalyticsOverview, UserManagement |
| `charts/` | **Data Visualization** | AreaChart, BarChart, PieChart |
| `tables/` | **Data Display** | DataTable, TableHeader |
| `animations/` | **Motion** | MotionWrapper, ScrollReveal |

---

## 🗺 Route Groups

The application uses Next.js Route Groups to create separate application contexts.

| Group | Path Pattern | Purpose |
|---|---|---|
| `(website)` | `/`, `/about`, `/blog`, `/cart`, `/collections`, `/contact`, `/login`, `/products`, `/register`, `/wishlist` | Public storefront |
| `(dashboard)` | `/dashboard`, `/dashboard/orders`, `/dashboard/products`, `/dashboard/categories`, `/dashboard/customers`, `/dashboard/messages`, `/dashboard/blog` | Admin application |

### Why Route Groups?

Route Groups allow the application to use different layouts for the storefront and dashboard without adding the group name to the URL.

---

## 🔌 API Endpoints

### Public

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/products` | List products with filters and pagination |
| `GET` | `/api/products/[id]` | Get product details |
| `GET` | `/api/categories` | List categories |
| `GET` | `/api/collections` | List collections |
| `GET` | `/api/blog` | Get published blog posts |
| `GET` | `/api/blog/[slug]` | Get a single blog post |
| `POST` | `/api/contact` | Submit contact form |

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/register` | Register |
| `GET` | `/api/auth/me` | Get current user |
| `POST` | `/api/auth/logout` | Logout |

### Cart & Wishlist

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` / `POST` | `/api/cart` | Get or add cart items |
| `PATCH` / `DELETE` | `/api/cart/[productId]` | Update or remove cart item |
| `GET` / `POST` | `/api/wishlist` | Get or add wishlist items |
| `DELETE` | `/api/wishlist/[productId]` | Remove wishlist item |

### Orders

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` / `POST` | `/api/orders` | List orders or place order |
| `GET` | `/api/orders/admin` | Get all orders |
| `GET` / `PATCH` | `/api/orders/admin/[id]` | Get or update an order |

### Admin

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` / `POST` | `/api/products/admin` | List or create products |
| `GET` / `PUT` / `DELETE` | `/api/products/admin/[id]` | Fetch, update, or archive product |
| `GET` / `POST` | `/api/categories/admin` | List or create categories |
| `GET` / `PUT` / `DELETE` | `/api/categories/[id]` | Fetch, update, or delete category |
| `GET` | `/api/users/admin` | List customers |
| `GET` / `PATCH` | `/api/users/admin/[id]` | Get or update customer |
| `GET` | `/api/contact/admin` | List messages |
| `GET` / `PATCH` / `DELETE` | `/api/contact/admin/[id]` | Manage message |
| `GET` / `POST` / `PUT` / `DELETE` | `/api/blog/admin` | Blog CRUD |
| `GET` | `/api/dashboard/overview` | Dashboard statistics |
| `POST` | `/api/uploads` | Upload images |
| `POST` | `/api/uploads/delete` | Delete uploaded image |

---

## ⚡ Performance & Best Practices

| Practice | Implementation |
|---|---|
| **Code Splitting** | Heavy components use dynamic imports |
| **GPU-Accelerated Animations** | Centralized motion components |
| **Nested Layouts** | Prevent unnecessary Navbar/Sidebar re-renders |
| **Optimized Fonts** | `next/font` for reduced layout shift |
| **Image Optimization** | `next/image` with proper sizing |
| **Raw SQL Queries** | Prepared statements for database queries |
| **Atomic Transactions** | Order creation and stock decrement handled transactionally |
| **Cancellation Safety** | Fetch effects prevent updates after unmount |
| **Non-blocking Views** | Product view counters can update asynchronously |

---

## 🤝 Contributing

When adding new features, follow the existing project organization.

### 📁 Where to Add Files

| What you're adding | Where it goes |
|---|---|
| New UI primitive | `src/components/common/` |
| New homepage section | `src/components/sections/` |
| New admin component | `src/components/dashboard/` |
| New data-fetching logic | `src/hooks/` |
| New global state | `src/context/` |
| New utility/helper | `src/lib/` |
| New API route | `src/app/api/<resource>/route.js` |
| New customer page | `src/app/(website)/<route>/page.jsx` |
| New admin page | `src/app/(dashboard)/dashboard/<route>/page.jsx` |

### 📝 Code Style

- Follow the existing ESLint configuration
- Use Tailwind CSS utility classes
- Extract complex logic into custom hooks
- Keep components small and focused
- Use `font-serif` for headings
- Use `font-sans` for body text
- Use the warm `stone-*` and `amber-*` palette
- Keep the storefront light-only
- Use subtle animations and avoid excessive motion
- Keep jewellery imagery as the primary visual focus

---

## 🎨 Design Principles

- **Warm & Premium** — Cream backgrounds, gold accents, and elegant typography
- **Jewellery-First** — Product imagery leads while copy supports
- **Responsive** — Designed mobile-first across screen sizes
- **Motion with Restraint** — Smooth fades, gentle lifts, and subtle interactions
- **Consistent** — Reusable components and shared design patterns
- **Light-Only Storefront** — No dark mode by design

---

<p align="center">
  <strong>Crafted to be worn for a lifetime.</strong>
  <br />
  <br />
  <strong>Shoaib Jewellers</strong> · Est. 1985 · Township, Lahore
</p>
