ConstructFlow

A modern construction management dashboard built with Next.js, React, TypeScript, and Tailwind CSS. ConstructFlow is inspired by enterprise platforms like Procore, designed specifically as a lightweight solution for small commercial construction businesses.

Overview

ConstructFlow provides a centralized interface for managing projects, tasks, RFIs, change orders, daily logs, documents, contacts, and construction operations workflows.

This project focuses on creating a scalable SaaS-style frontend architecture with responsive layouts, reusable UI components, and realistic construction management workflows.

Live Features
Dashboard
Project overview cards
Budget analytics charts
Task status visualization
Active project tracking
Recent activity feed
Upcoming schedule panel
Projects
Centralized project management
Dynamic project detail pages
Status tracking
Budget and completion progress
Tasks / Punch Lists
Task management interface
Priority badges
Status tracking
Assignee workflows
Daily Logs
Crew tracking
Weather logging
Daily progress summaries
Jobsite reporting workflows
Documents
File management UI
Plans, permits, photos, and uploads
Project document organization
RFIs
Request for Information tracking
Status and priority management
Due date workflows
Change Orders
Scope change management
Approval workflows
Budget impact tracking
Contacts
Clients
Vendors
Subcontractors
Project stakeholders
Tech Stack
Frontend
Next.js 16
React
TypeScript
Tailwind CSS
shadcn/ui
Lucide React Icons
Recharts
Tooling
ESLint
Turbopack
Vercel Deployment
Git & GitHub
Architecture

The project is structured around reusable SaaS UI patterns:

src/
  app/
  components/
    dashboard/
    layout/
    ui/
  data/
Reusable Components
AppShell
Sidebar
Topbar
PageHeader
StatCard
StatusBadge
ActivityFeed
BudgetChart
TaskStatusChart
ActiveProjects
UpcomingSchedule
Responsive Design

ConstructFlow includes:

Mobile sidebar drawer
Responsive dashboard layouts
Adaptive grid systems
SaaS-style desktop navigation
Current Status
Completed
Frontend MVP
Dashboard UI
Dynamic routing
Construction workflow pages
Shared mock data architecture
Responsive layouts
Analytics charts
Planned
Authentication
Supabase integration
Database models
File uploads
CRUD operations
Kanban task board
Calendar scheduling
Dark mode
Notifications
Role permissions
Search and filtering
Installation

Clone the repository:

git clone https://github.com/mesem24-rgb/construct-flow.git

Navigate into the project:

cd construct-flow

Install dependencies:

npm install

Start development server:

npm run dev

Open:

http://localhost:3000
Goals

This project was built to:

simulate a real-world construction SaaS platform
strengthen frontend/full-stack engineering skills
demonstrate scalable React architecture
build reusable enterprise UI systems
model realistic commercial construction workflows
Inspiration

Inspired by:

Procore
modern SaaS dashboards
construction project management platforms
Author

Michael Sullivan

Frontend Developer | React • Next.js • TypeScript

Portfolio
GitHub
LinkedIn
