# 📡 Portfolio Server

This is the backend API for the personal developer portfolio. It handles authentication, project/blog/skill management, and connects with the client-side portfolio and admin dashboard.

🌐 **Frontend Client:** [Portfolio Website](https://subirdas-portfolio.vercel.app/)  
📁 **Backend Server:** [Portfolio Server](https://my-portfolio-server-five-delta.vercel.app/)  
🔧 **Admin Dashboard:** [Visit Dashboard](https://my-portfolio-dashboard-six.vercel.app/)- Connected app to manage content (projects, blogs, skills)

---

## ✨ Features

- RESTful API with Express & TypeScript
- Role-based authentication using JWT & Bcrypt
- CRUD operations for:
  - Projects
  - Blogs
  - Skills
- MongoDB database with Mongoose models
- CORS support and secure environment config

---

## 🛠 Technologies

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB + Mongoose**
- **JWT (Authentication)**
- **Bcrypt (Password hashing)**
- **Dotenv (Environment variables)**
- **CORS**

---

## 🔐 API Endpoints

### 🔑 Auth
- `POST /api/auth/login` – Login with email & password

### 📦 Projects
- `GET /api/projects` – Get all projects  
- `POST /api/projects` – Add new project  
- `PATCH /api/projects/:id` – Edit project  
- `DELETE /api/projects/:id` – Delete project

### ✍️ Blogs
- `GET /api/blogs`  
- `POST /api/blogs`  
- `PATCH /api/blogs/:id`  
- `DELETE /api/blogs/:id`

### 💡 Skills
- `GET /api/skills`  
- `POST /api/skills`  
- `PATCH /api/skills/:id`  
- `DELETE /api/skills/:id`

> All POST, PATCH, DELETE routes are protected and require valid JWT tokens.


