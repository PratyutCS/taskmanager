# MERN Task Manager

A production-ready MERN task-manager web application with a vibrant emerald, dark-night neon UI and a responsive layout.

## Features

- **Task Management:** Create, edit, and delete tasks with titles, descriptions, due dates, and priority.
- **Drag-and-Drop:** Reorder tasks within and between lists with smooth drag-and-drop functionality.
- **Real-time Updates:** Changes are instantly reflected across all connected clients using WebSockets.
- **Task Aging:** A server-side scheduler prevents task starvation by automatically increasing the priority of stagnant tasks.
- **Single Working Task:** Only one task can be in the "working" state at a time, ensuring focus.
- **Work Logging:** Log time and add notes to tasks that are in the "working" state.
- **Calendar View:** Visualize tasks by their creation and completion dates in a full-sized calendar.
- **Filtering and Sorting:** Easily find tasks with powerful filtering, sorting, and search capabilities.
- **Authentication:** Secure JWT-based authentication for user registration and login.
- **Dockerized:** Comes with Dockerfiles and a docker-compose setup for easy local development.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Socket.IO Client, react-router-dom, @dnd-kit
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO, JWT, node-cron
- **Database:** MongoDB
- **Testing:** Jest, Supertest, MongoDB Memory Server

## Setup and Installation

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose

### Local Development

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies for both frontend and backend:**
   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   ```

3. **Set up environment variables:**
   Create a `.env` file in the `backend` directory and add the following:
   ```
   JWT_SECRET=your_jwt_secret
   MONGODB_URI=mongodb://localhost:27017/taskmanager
   AGING_THRESHOLD_HOURS=24
   AGING_PRIORITY_BUMP=1
   ```

4. **Run the application without Docker:**
   - Start the backend: `npm start --prefix backend`
   - Start the frontend: `npm run dev --prefix frontend`

5. **Run the application with Docker:**
   ```bash
   docker-compose up --build
   ```
   The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## API Documentation

The API is documented using the OpenAPI specification. (This would be a future step to add a swagger UI).

**Authentication**

- `POST /api/users/register`: Register a new user.
- `POST /api/users/login`: Log in a user and get a JWT.

**Tasks**

- `GET /api/tasks`: Get all tasks for the authenticated user.
- `POST /api/tasks`: Create a new task.
- `PUT /api/tasks/:id`: Update a task.
- `DELETE /api/tasks/:id`: Delete a task.
- `PUT /api/tasks/order`: Update the order of tasks.

**Work Logs**

- `POST /api/worklog/:taskId`: Create a new work log entry for a task.
- `GET /api/worklog/:taskId`: Get all work log entries for a task.

## Aging Algorithm

The aging algorithm is a server-side scheduler that runs every hour. It prevents tasks from being starved by automatically increasing the priority of tasks that have not been updated recently.

- **Threshold:** The `AGING_THRESHOLD_HOURS` environment variable (default: 24 hours) determines how long a task can be inactive before its priority is bumped.
- **Priority Bump:** The `AGING_PRIORITY_BUMP` environment variable (default: 1) determines how much the priority is increased.
- **Pinned Tasks:** Tasks with `pinned: true` are exempt from the aging algorithm.
- **Max Priority:** Tasks with a priority of 100 are also exempt from the aging algorithm.

## Deployment

This application is ready to be deployed to any platform that supports Docker containers, such as Heroku, Render, or a VPS.

**Example Deployment to Heroku:**

1.  **Create a Heroku app.**
2.  **Add a MongoDB add-on** (e.g., mLab).
3.  **Set the environment variables** in your Heroku app's settings.
4.  **Push the code to Heroku.** Heroku will automatically build and deploy the application using the `Dockerfile` and `heroku.yml` (if you create one).

---
This README provides a comprehensive overview of the project, including setup instructions, API documentation, and an explanation of the aging algorithm. It is a living document and should be updated as the project evolves.
