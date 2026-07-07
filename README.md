# 🚀 MeetWithUs

> **AI-Powered Meeting Management Platform built with MERN, Microservices & GenAI**

MeetWithUs is a production-ready full-stack application that helps individuals, educators, startups, and organizations manage meetings intelligently using Artificial Intelligence.

Instead of simply scheduling meetings, MeetWithUs automates the entire meeting workflow—from creating meetings and sending invitations to generating AI summaries and enabling semantic search over previous meetings using RAG (Retrieval-Augmented Generation).

This project is being built as a learning project while following real-world software engineering practices, including Microservices Architecture, Docker, Redis, RabbitMQ, AWS deployment, and modern Node.js development standards.

---

# 📌 Problem Statement

Managing meetings manually becomes difficult as teams grow.

Some common problems are:

- Scheduling meetings manually
- Sending invitations one by one
- Forgetting to notify attendees
- Losing important meeting notes
- Difficulty searching previous discussions
- No AI assistance for meeting summaries
- Time wasted creating follow-up emails

MeetWithUs solves these problems using AI and automation.

---

# 💡 Solution

MeetWithUs provides one platform where users can:

- Create meetings
- Schedule meetings
- Send email invitations automatically
- Generate AI meeting summaries
- Store meeting history
- Search previous meetings using AI
- Manage attendees
- Receive reminders
- Generate action items automatically

---

# ⭐ Unique Features

- 🤖 AI-generated meeting summaries
- 📚 RAG-powered semantic meeting search
- 📧 Automatic Gmail invitations
- 📅 Google Calendar integration
- 🔔 Real-time notifications
- 🧠 AI action item generation
- 📂 Meeting history
- 👥 Team collaboration
- 🔒 JWT Authentication
- ⚡ Redis caching
- 📨 RabbitMQ event communication
- 🐳 Dockerized microservices
- ☁️ AWS deployment

---

# 🏗 Architecture

```
                   React Frontend
                          │
                          ▼
                    API Gateway
                          │
        ┌─────────────────┼──────────────────┐
        ▼                 ▼                  ▼
   Auth Service     Meeting Service     AI Service
        │                 │                  │
        ▼                 ▼                  ▼
    MongoDB          MongoDB           Qdrant Vector DB
                          │
                          ▼
                    Email Service
                          │
                          ▼
                       Gmail API
```

---

# 🧩 Microservices

## API Gateway

Responsible for:

- Routing requests
- Authentication forwarding
- Rate limiting
- Logging
- Security
- API versioning

---

## Auth Service

Responsible for:

- User registration
- Login
- JWT Authentication
- Refresh Tokens
- Password hashing
- User management

---

## Meeting Service

Responsible for:

- Creating meetings
- Updating meetings
- Cancelling meetings
- Meeting history
- Attendee management

---

## AI Service

Responsible for:

- Meeting summaries
- AI insights
- Action items
- RAG search
- Semantic search
- AI recommendations

---

## Email Service

Responsible for:

- Sending Gmail invitations
- Reminder emails
- Follow-up emails
- Notification emails

---

# 🤖 AI Features

MeetWithUs uses Generative AI to automate meeting-related tasks.

Examples:

### AI Meeting Summary

Input:

> One-hour meeting transcript

Output:

- Summary
- Key decisions
- Action items
- Deadlines

---

### AI Search

Instead of searching by keywords:

```
meeting about React
```

Users can search naturally:

```
Show meetings where we discussed Docker deployment.
```

RAG finds the most relevant meetings based on meaning, not exact words.

---

### AI Action Items

Example:

Meeting Transcript

```
John will complete the UI by Friday.
Anisul will deploy the backend.
```

AI automatically generates:

- John → Finish UI → Friday
- Anisul → Deploy Backend

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

---

## Authentication

- JWT
- bcrypt

---

## AI

- LangChain
- OpenAI API (or compatible LLM)
- RAG
- Qdrant Vector Database

---

## Messaging

- RabbitMQ

---

## Caching

- Redis

---

## Deployment

- Docker
- Docker Compose
- AWS EC2
- Nginx

---

# 📂 Project Structure

```
MeetWithUs/

frontend/

gateway/

services/
│
├── auth-service/
├── meeting-service/
├── ai-service/
└── email-service/

shared/

docker/

docs/

README.md
```

---

# 🔄 Project Workflow

```
User Login
      │
      ▼
API Gateway
      │
      ▼
Auth Service
      │
      ▼
JWT Generated
      │
      ▼
Frontend
      │
      ▼
Create Meeting
      │
      ▼
Meeting Service
      │
      ▼
RabbitMQ Event
      │
      ▼
Email Service
      │
      ▼
Gmail Invitation Sent
      │
      ▼
Meeting Ends
      │
      ▼
AI Service
      │
      ▼
Summary Generated
      │
      ▼
Stored in Vector Database
      │
      ▼
Searchable using RAG
```

---

# 🔐 Authentication Flow

```
Register

↓

Login

↓

JWT Access Token

↓

Frontend Stores Token

↓

Protected APIs

↓

Refresh Token

↓

New Access Token
```

---

# 📈 Learning Goals

This project is designed to help developers learn:

- MERN Stack
- Backend Architecture
- Microservices
- Docker
- Redis
- RabbitMQ
- JWT Authentication
- REST API Design
- MongoDB
- AI Integration
- RAG
- AWS Deployment
- Clean Code
- Production-level Folder Structure

---

# 🎯 Who is this project for?

- Students learning Full Stack Development
- Backend Developers
- MERN Stack Developers
- AI Engineers
- Software Engineering Students
- Developers preparing for technical interviews
- Developers building portfolio projects

---

# 🚀 Development Roadmap

- [x] Project Initialization
- [x] API Gateway
- [x] Auth Service Setup
- [x] User Registration
- [x] Login API
- [x] JWT Authentication Middleware
- [x] Meeting Service
- [x] Email Service
- [x] RabbitMQ Integration
- [x] Redis Integration
- [x] AI Service
- [x] RAG Implementation
- [x] Frontend Development
- [ ] Dockerization
- [ ] AWS Deployment
- [ ] CI/CD Pipeline

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

Feel free to fork the repository, open issues, or submit pull requests.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Anisul Islam**

Computer Science Engineer | MERN Stack Developer | Backend Developer | AI Enthusiast

Building **MeetWithUs** to demonstrate how modern AI-powered SaaS applications are designed using industry-standard architecture and best practices.