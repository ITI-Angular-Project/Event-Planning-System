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

```bash
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
│   │   │   ├── public-layout/                  # Navbar + Footer layout for main site
│   │   │   └── dashboard-layout/               # Sidebar + Header for admin/organizer dashboard
│   │   │
│   ├── pages/
│   │   ├── public/                         # Main website pages (Home, About, Contact)
│   │   │   ├── home/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   └── auth/                       # Login/Register (for guests or organizers)
│   │   │
│   │   ├── dashboard/                      # Organizer/Admin area
│   │   │   ├── home/                       # Dashboard main overview (stats, charts)
│   │   │   ├── events/
│   │   │   │   ├── events-list.component.ts
│   │   │   │   ├── event-details/
│   │   │   ├── reports/
│   │   │   ├── users/
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
│   ├── styles.css              # Global styles + Tailwind imports
│   └── main.ts                  # Bootstrap application
│
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── angular.json                 # Angular build configuration
├── package.json                 # Project dependencies
└── README.md                    # Project documentation
