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

The **MERN Stack Blog** is a full-stack blog application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The application allows users to create, edit, and manage blog posts with full CRUD (Create, Read, Update, Delete) functionality. It also includes user authentication for managing personalized blog posts.

## Technologies

The project uses the following technologies:

- **MongoDB**: For the database to store blog posts and user data.
- **Express.js**: To handle the backend routing and API requests.
- **React.js**: For building the user interface and client-side routing.
- **Node.js**: As the runtime environment for running the backend server.
- **JWT (JSON Web Tokens)**: For handling user authentication and authorization.
- **Mongoose**: For object modeling and MongoDB interaction.
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
- MongoDB installed and running locally or accessible through a service like MongoDB Atlas.

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
    - Create a `.env` file in the `backend` directory with the following environment variables:
      ```env
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
      PORT=5000
      ```
    - Start the backend server:
      ```bash
      npm run dev
      ```

3. **Frontend Setup**:
    - Navigate to the `frontend` directory:
      ```bash
      cd ../frontend
      ```
    - Install dependencies:
      ```bash
      npm install
      ```
    - Create a `.env` file in the `frontend` directory:
      ```env
      REACT_APP_API_URL=http://localhost:5000
      ```
    - Start the frontend server:
      ```bash
      npm start
      ```

4. **Access the Application**:
    - Frontend: `http://localhost:3000`
    - Backend: `http://localhost:5000`

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
│   ├── models/          # Mongoose models
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
  
