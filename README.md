# AI Task Manager

AI Task Manager is a smart daily task management web app built with React and a lightweight Python backend. It helps users create, organize, prioritize, search, sort, import, and export tasks, with AI-assisted features for priority suggestions and automatic task breakdown.

## Features

- User registration and login
- Add, edit, complete, delete, and reorder tasks
- Priority levels: High, Medium, Low
- Due dates with overdue and upcoming task indicators
- Search, filter, and sort tasks
- Dashboard statistics for total, completed, pending, and overdue tasks
- Suggested next task based on urgency
- Dark and light theme toggle
- English and Arabic language toggle
- Export tasks to a JSON backup file
- Import tasks from a JSON backup file
- AI-assisted priority suggestion
- AI-assisted task breakdown into smaller subtasks

## AI-Assisted Features

The current AI features are implemented locally with smart rule-based logic:

- **Suggest Priority** analyzes the task title and due date, then recommends High, Medium, or Low priority.
- **Split Task** turns a large task into smaller actionable subtasks, such as planning, drafting, testing, and reviewing.

These features do not require an external AI API key. They can later be upgraded to use an LLM API such as OpenAI for more advanced natural-language planning.

## Tech Stack

- Frontend: React, Vite, lucide-react
- Backend: Python `http.server`
- Storage: Local JSON files
- Styling: CSS-in-JS inside React components

## Project Structure

```text
AI-Task-Manager/
├── backend/
│   ├── server.py
│   └── requirements.txt
├── frontend/
│   ├── App.jsx
│   └── Auth.jsx
├── public/
│   └── logo.png
├── src/
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- Python 3

### Install Frontend Dependencies

```bash
npm install
```

### Run the Backend

```bash
python backend/server.py
```

The backend runs by default on:

```text
http://localhost:4000
```

### Run the Frontend

Open a second terminal and run:

```bash
npm run dev
```

Then open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

On Windows PowerShell, if script execution is blocked, use:

```bash
npm.cmd run build
```

## API Endpoints

### Auth

- `POST /api/register` creates a new user
- `POST /api/login` logs in an existing user
- `GET /api/users` lists users

### Tasks

- `GET /api/tasks` returns all tasks
- `POST /api/tasks` creates a task
- `PUT /api/tasks/:id` updates a task
- `DELETE /api/tasks/:id` deletes a task

## Data Storage

The backend stores data in local JSON files:

- `backend/tasks.db.json`
- `backend/users.db.json`

These files are ignored by Git because they contain local app data. The server creates them automatically when needed.

## Notes

- This project is designed for learning, portfolio use, and small local demos.
- Passwords are currently stored in plain text in the local JSON file. For production, use password hashing and a real database.
- The AI features are rule-based and local, not connected to an external AI service yet.

## Future Improvements

- Connect AI features to an LLM API
- Add password hashing
- Store tasks per user
- Add categories or labels
- Add reminders and notifications
- Add calendar view
- Add deployment configuration
