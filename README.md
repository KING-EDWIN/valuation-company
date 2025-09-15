# Otic – Valuers Meeting Management System

This is a demo application for managing the workflow of a property valuation company, built with **Next.js** and **Material UI**. It features role-based access for all key steps in the valuation process, from client instruction to final billing.

## Features
- **Role-based login**: Client, Admin, Survey Manager, Field Team, QA Officer, Managing Director, Accounts
- **Dashboard**: See actions relevant to your role
- **Process Flow**: Each step in the business process is a protected page
- **Org Chart & Process Flow**: Visualize company structure and workflow
- **Modern UI**: Built with Material UI

## Roles & Flow
1. **Client**: Submit instruction
2. **Admin**: Assign inspection, admin reporting
3. **Survey Manager**: Assign field team
4. **Field Team**: Inspection reporting, report writing
5. **QA Officer**: Quality assurance
6. **Managing Director**: Approve/reject reports
7. **Accounts**: Final billing

## Getting Started (Local Development)

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment (Vercel)
1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com), import your repo, and deploy (Next.js is auto-detected).

---

**Demo Users:**
- Login as any role from the login page to see the relevant dashboard and actions.
- All flows are demo-only (no real backend or data persistence).

---

Built as a comprehensive valuation company workflow management system for Otic.
