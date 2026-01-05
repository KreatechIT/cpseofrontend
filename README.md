# CorePath360 Frontend

Frontend application for the **CorePath360 (CP360) platform**, built with **React 19**, **Vite**, **Tailwind CSS**, **ShadCN UI**, **Redux**, **React Router Dom** and **Axios**.

## Tech Stack

- **Framework:** React 19
- **Bundler:** Vite
- **Styling:** Tailwind CSS v4, ShadCN UI
- **State Management:** Redux Toolkit, Redux Persist
- **Routing:** React Router DOM v7
- **HTTP Client:** Axios
- **Date & Time:** date-fns, react-day-picker
- **Forms & Validation:** Formik, Yup
- **Animations:** Motion, tw-animate-css
- **Charts:** Recharts
- **Rich Text Editor:** TipTap
- **Icons:** Lucide React

---

## Getting Started

### Prerequisites

- Node.js >= 22.14.0
- npm >= 10 (bundled with Node 22+)

### Installation

1. Clone the repository:

```bash
git clone git@github.com:KreatechIT/core360-frontend.git
cd core360-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Building for Production:

```bash
npm run build
```

5. Preview the production build:

```bash
npm run preview
```

### Available Scripts

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start development server with hot reload |
| `npm run build`   | Build the project for production         |
| `npm run preview` | Preview production build locally         |
| `npm run lint`    | Run ESLint checks on the codebase        |

## Project Structure & Naming Conventions

### Folder Structure

```
core360-frontend/
├─ public/                  # Static assets served publicly
├─ src/
│  ├─ assets/               # Images, fonts, icons, and other assets
│  ├─ components/           # Reusable UI components
│  │  ├─ ui/                # ShadCN UI components
│  │  ├─ themes/            # Dark/light theme components
│  │  ├─ icons/             # SVG or icon components
│  │  ├─ filters/           # Filter-related components (month picker, search, etc.)
│  │  ├─ input-fields/      # Form input fields
│  │  └─ sidebar/           # Reusable sidebar components
│  ├─ modules/              # Feature modules (each module has pages, components, store, services, layouts, validations, etc.)
│  ├─ hooks/                # Custom React hooks
│  ├─ lib/                  # Helper libraries
│  ├─ pages/                # Top-level pages
│  ├─ routes/               # Route configuration
│  ├─ services/             # Axios instances and API services
│  ├─ store/                # Redux store and slices
│  ├─ utils/                # Utility functions
│  ├─ App.jsx               # Main App component
│  ├─ index.css             # Global styles
│  └─ main.jsx              # Entry point for React
├─ components.json          # ShadCN components config
├─ eslint.config.js         # ESLint configuration
├─ index.html               # Main HTML file
├─ jsconfig.json            # Path configuration
├─ vercel.json              # Vercel deployment configuration
└─ vite.config.js           # Vite configuration

```

### Folder Naming

- Use **kebab-case** (lowercase with hyphens) for folder names.
- Example:

```text
modules/
  finance-module/
  hr-module/
```

### File Naming

#### React Components

- Use **PascalCase** for React Component names.
- Example:

```text
Navbar.jsx
LoginForm.jsx
DashboardCard.jsx
```

#### Hooks, Utilities, API services, Stores

- Use **camelCase**.
- Example:

```text
authApi.js
dashboardStore.js
formatDate.js
```

#### Styles

- Use **kebab-case**.
- Example:

```text
index.css
```
