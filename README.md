# MERN Stack Blog Project

## Table of Contents

1. [Introduction](#introduction)
2. [Technologies](#technologies)
3. [Features](#features)
4. [Setup and Installation](#setup-and-installation)
5. [Usage](#usage)
6. [API Documentation](#api-documentation)
7. [Project Structure](#project-structure)
8. [Contributing](#contributing)
9. [License](#license)

---

## Introduction

The **New Yorker Blog** is a full-stack blog application built with React, Express, and Neon Postgres. The application allows users to create, edit, and manage blog posts with full CRUD functionality and authentication.

## Technologies

The project uses the following technologies:

- **Neon**: Serverless PostgreSQL database for blog posts and user data.
- **Express.js**: To handle the backend routing and API requests.
- **React.js**: For building the user interface and client-side routing.
- **Node.js**: As the runtime environment for running the backend server.
- **JWT (JSON Web Tokens)**: For handling user authentication and authorization.
- **Drizzle ORM**: For PostgreSQL schema management and queries.
- **Axios**: To handle HTTP requests from the frontend to the backend.
- **Tailwind CSS**: For styling the user interface components.

## Features

- User Authentication (Login/Signup)
- Create, Edit, Delete, and View Blog Posts
- Responsive Design
- Commenting System
- Categories and Tags for Posts
- Profile Management
- Dashboard for Admin and User Roles
- Full-Text Search for Posts

## Setup and Installation

### Prerequisites

- Node.js and npm/yarn installed.
- A Neon PostgreSQL database and its connection URL.

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/mern-blog.git
    cd mern-blog
    ```

2. **Backend Setup**:
    - Navigate to the `backend` directory:
      ```bash
      cd backend
      ```
    - Install dependencies:
      ```bash
      npm install
      ```
    - Create a `.env` file in the `backend` directory with:
      ```env
      DATABASE_URL=your_neon_postgres_connection_string
      JWT_SECRET=your_jwt_secret
      PORT=5000
      ```
    - Apply the database schema:
      ```bash
      npm run db:migrate
      ```
    - Start the backend server:
      ```bash
      npm run dev
      ```

3. **Frontend Setup**:
    - In a second terminal, navigate to the `frontend` directory:
      ```bash
      cd frontend
      ```
    - Install dependencies:
      ```bash
      npm install
      ```
    - Create a `.env` file in the `frontend` directory:
      ```env
      VITE_API_URL=http://localhost:5000
      ```
    - Start the frontend server:
      ```bash
      npm run dev
      ```

4. **Access the Application**:
    - Frontend: `http://localhost:5173`
    - Backend: `http://localhost:5000`

### Database migrations

Update `backend/db/schema.js`, generate a migration with
`cd backend && npm run db:generate -- --name describe_change`, and apply it with
`npm run db:migrate`. The application now reads and writes Neon data through the shared
Drizzle instance in `backend/db/index.js`; existing MongoDB records are not migrated.

## Usage

Once the project is running, you can create a new user by signing up. After logging in, you will be able to create, edit, and delete your own blog posts. You can also view other users' posts, filter by categories or tags, and search for specific posts.

## API Documentation

| HTTP Method | Endpoint               | Description                  |
|-------------|------------------------|------------------------------|
| `POST`      | `/api/users/register`   | Register a new user           |
| `POST`      | `/api/users/login`      | Login a user                  |
| `GET`       | `/api/posts`            | Get all blog posts            |
| `POST`      | `/api/posts`            | Create a new blog post        |
| `GET`       | `/api/posts/:id`        | Get a specific blog post      |
| `PUT`       | `/api/posts/:id`        | Update a specific blog post   |
| `DELETE`    | `/api/posts/:id`        | Delete a specific blog post   |

## Project Structure

```bash
mern-blog/
│
├── backend/             # Express.js backend
│   ├── controllers/     # API controllers
│   ├── db/              # Drizzle schema, connection, and migrations
│   ├── routes/          # Express routes
│   └── server.js        # Entry point for the backend
│
├── frontend/            # React.js frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # React pages
│   │   ├── utils/       # Utility functions
│   │   └── App.js       # Main application file
│   └── public/          # Public assets
│
└── README.md            # Project documentation
  
