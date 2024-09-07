MyPlan Application

## Overview
MyPlan is a comprehensive task management application designed to help users organize their daily activities, set goals, and track progress. The app provides an intuitive interface for creating and managing plans, each containing a list of tasks.

## Key Features
- User Authentication: Secure login and registration system
- Multiple Plans: Create and manage multiple to-do lists or plans
- Task Management: Add, edit, delete, and prioritize tasks within each plan
- Dashboard: Overview of all tasks across different plans
- Calendar View: Visualize tasks in a weekly or monthly calendar format
- Local Storage: User data persists in the browser's local storage

## Pages
- Welcome: Introduction and navigation to login/register
- Register: New user registration
- Login: User authentication
- Dashboard: Overview of all tasks and plans
- Plan: Detailed view and management of individual plans
- PlanName: Create a new plan

## Components
- Sidebar: Navigation and plan management
- Layout: Consistent structure for authenticated pages
- TableView: Tabular display of tasks in the dashboard
- CalendarView: Calendar display of tasks in the dashboard

## Utilities
- taskUtils: Helper functions for task management and grouping

## Custom Hooks
- useTaskData: Manages task data fetching and state

## Technologies Used
- React
- React Router
- Tailwind CSS
- date-fns for date manipulation
- react-beautiful-dnd for drag-and-drop functionality

## Getting Started
Prerequisites:
    Make sure you have Node.js and npm installed on your machine. You can download them from https://nodejs.org/en
Installation Steps:
1. Clone the repository 
2. Install dependencies: `npm install`
3. Environment Setup:
    - You may need to set up environment variables (if required) in a .env  file.
    - Example: REACT_APP_API_URL=http://localhost:5000
4. Run the application: `npm start`
    This will start the development server and you can access the app in your browser at http://localhost:3000.

## Running the Tests
- Tests are written using Jest and React Testing Library.
- To run tests, use `npm test`.

## Build for Production
- To create a production build, run use `npm run build`.

## Assumptions and Decisions
- Local Storage vs. SQLite: Initially, the application used Local Storage for simplicity and fast development. However, But as the application grows more and more,In the future it became clear that switching to SQLite would offer better data management and flexibility, especially for local development without needing a complex database setup.
- React for Frontend: React was chosen for its component-based architecture, which allows for better state management and a more organized structure when dealing with tasks and plans. The decision to use React Router was made to ensure smooth navigation between different pages of the application.
- UI Design: Tailwind CSS was used for styling due to its utility-first approach, which made designing the interface faster and more customizable without writing extensive custom CSS.
- Drag-and-Drop Functionality: The inclusion of react-beautiful-dnd for drag-and-drop task management was to enhance user experience by allowing users to easily reorder tasks.

