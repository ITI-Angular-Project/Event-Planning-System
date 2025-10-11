# 🎯 Event Planning System (Frontend Only)

A role-based **Event Planning & Management System** built with **Angular 20 (Zoneless)** and **TailwindCSS**.  
This project simulates a complete event management workflow entirely on the frontend using `localStorage` and mock data — with full CRUD functionality, dashboards, and analytics.

---

## 🚀 Features

- 🔐 Role-based access (Organizer / Guest / Admin)
- 🗓️ Event creation, editing, filtering, and auto-status updates
- 👥 Guest invitations & feedback
- ✅ Task assignment & progress tracking
- 💰 Expense tracking with charts and totals
- 📊 Dashboard analytics (Events, Guests, Expenses, Ratings)
- 🌗 Light/Dark theme
- 💾 Data stored locally (no backend required)
- 🧱 Responsive UI using **TailwindCSS**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Framework** | Angular 20 (Standalone Components, Zoneless) |
| **Styling** | TailwindCSS |
| **Charts** | Chart.js / ng2-charts |
| **Storage** | localStorage / mock JSON data |
| **Language** | TypeScript |
| **Build Tool** | Angular CLI 20 |

---

## 📁 Project Structure

Event-Planning-System/
│
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/          # Interfaces (Event, Task, Guest, Expense, Feedback)
│   │   │   ├── services/        # Data & Storage Services using Signals
│   │   │   ├── guards/          # Route guards (Auth, Role-based)
│   │   │   └── utils/           # Helper functions, constants
│   │   │
│   │   ├── layouts/             # App layouts (Navbar, Sidebar, Container)
│   │   │   ├── main-layout/
│   │   │   └── auth-layout/
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/            # Login / Register (mock)
│   │   │   ├── dashboard/       # Overview cards & charts
│   │   │   ├── events/
│   │   │   │   ├── list/        # All events table
│   │   │   │   ├── details/
│   │   │   │   ├── overview/
│   │   │   │   ├── guests/
│   │   │   │   ├── tasks/
│   │   │   │   ├── expenses/
│   │   │   │   ├── feedback/
│   │   │   │   └── reports/
│   │   │   └── settings/
│   │   │
│   │   ├── shared/
│   │   │   ├── components/      # Reusable UI (Modal, Table, Chart, Toast, ProgressBar)
│   │   │   ├── directives/
│   │   │   └── pipes/
│   │   │
│   │   ├── app.routes.ts        # Application routing configuration
│   │   └── app.config.ts        # App bootstrap configuration (Zoneless)
│   │
│   ├── assets/                  # Images, icons, JSON data
│   ├── environments/            # Environment configs
│   ├── styles.scss              # Global styles + Tailwind imports
│   └── main.ts                  # Bootstrap application
│
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── angular.json                 # Angular build configuration
├── package.json                 # Project dependencies
└── README.md                    # Project documentation


---

## ⚙️ Installation

```bash
# 1️⃣ Clone repository
git clone https://github.com/ITI-Angular-Project/Event-Planning-System.git
cd Event-Planning-System

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start development server
ng serve


Open http://localhost:4200/
