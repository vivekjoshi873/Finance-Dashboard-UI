# Fintrack

Fintrack is a modern, premium financial dashboard to help you track your income and expenses, analyze spending habits, and improve your savings rate.

## Features

- **Dashboard Overview**: Get a bird's-eye view of your net balance, total income, and total expenses. Visual monthly trends and exact spending breakdowns are provided with interactive charts.
- **Transactions Management**: Complete tracking of every dollar. Features include rich filtering (by category, text description, or type), sorting, and immediate visual categorization.
- **Insights & Analytics**: Deep dive into your lifestyle habits. View your top spending categories, calculated savings rate, and month-over-month performance changes.
- **Role-Based Access Control (RBAC)**: Switch seamlessly between Admin (full write/delete permissions) and Viewer (read-only mode) roles directly from the top navigation UI. 
- **Local Persistence**: Powered by Zustand's `persist` middleware, all your transactions and UI states are safely saved to your browser's local storage—data survives any page refresh.
- **Beautiful Design**: A customized dark theme utilizing CSS variables, responsive grids, and subtle animations aiming to be lightweight, yet feel premium and bespoke.

## Tech Stack

- **React 19**
- **Vite**
- **React-Router-Dom v6** for modular routing (`/`, `/transactions`, `/insights`).
- **Zustand** for global state management and persistence.
- **Recharts** for visualizing monthly trends and category breakdowns via dynamic pie/area/bar charts.
- **Vanilla CSS** for all styles without bringing in heavy utility frameworks.

## Setup Instructions

1. **Install dependencies**. Make sure you have Node installed, then run:

\`\`\`bash
npm install
\`\`\`

2. **Start the development server**.

\`\`\`bash
npm run dev
\`\`\`

3. Open your browser and navigate to the localhost port provided (usually `http://localhost:5173`).

## Using Role-Based UI (RBAC)

At the top right corner of the dashboard, you'll find a Role Switcher dropdown.
- **Admin**: Grants access to the "+ Add Transaction" button and allows you to delete existing transactions from the Transactions page.
- **Viewer**: Hides all mutation controls and displays a read-only floating notice at the bottom to remind you of your current state. 
*Note: Roles are globally managed using Zustand and enforced throughout the component tree.*

## State Management

Fintrack uses **Zustand** instead of scattered, prop-drilled React states.
1. The `useStore` store handles:
   - The transactions array (which comes pre-loaded with comprehensive mock data).
   - The currently active UI role.
   - Filter terms, search string, active categories, and active sort modes for the Transactions list.
2. We opted to apply Zustand's `persist` middleware, which wraps the store and automatically serializes the data to `localStorage`. This means your actions persist without needing a backend server database for this iteration.
