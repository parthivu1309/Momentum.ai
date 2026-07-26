# Deployment

**Project Name:** Discipline AI

**Version:** 1.0

---

# Overview

Discipline AI follows a cloud-first deployment architecture.

Each major component of the application is deployed independently to improve scalability, maintainability and reliability.

The MVP consists of four primary services:

- Frontend
- Backend
- Database
- Artificial Intelligence

The services communicate securely over HTTPS.

---

# Deployment Architecture

```
                    Users
                      │
                      ▼
             Next.js Frontend
                  (Vercel)
                      │
              HTTPS REST API
                      │
                      ▼
             NestJS Backend
                 (Railway)
                      │
      ┌───────────────┼───────────────┐
      │               │               │
      ▼               ▼               ▼
 Firebase       Gemini API      Telegram Bot
 Firestore                      Webhook
```

---

# Deployment Stack

| Component | Platform |
|------------|----------|
| Frontend | Vercel |
| Backend | Railway |
| Database | Firebase Firestore |
| Authentication | Firebase Authentication |
| AI Provider | Google Gemini API |
| Telegram Bot | Telegram Bot API |
| Source Code | GitHub |

---

# Frontend Deployment

Technology

- Next.js
- TypeScript
- Tailwind CSS

Platform

- Vercel

Responsibilities

- Dashboard
- Authentication UI
- Timetable
- Reports
- Charts
- Settings

The frontend communicates only with the backend.

It never communicates directly with Firestore.

---

# Backend Deployment

Technology

- NestJS
- TypeScript

Platform

- Railway

Responsibilities

- Authentication
- REST API
- Business Logic
- Analytics
- AI Integration
- Telegram Integration
- Scheduler

The backend is the central service of the application.

---

# Database Deployment

Platform

- Firebase Firestore

Responsibilities

Store

- Users
- Timetables
- Tasks
- Behaviour Events
- Reports
- AI Insights
- Notification Logs
- User Settings

Firestore should never contain business logic.

---

# Authentication

Platform

- Firebase Authentication

Supported Providers

- Google
- Email / Password

Future

- GitHub
- Apple
- Microsoft

Authentication tokens are verified by the backend.

---

# Artificial Intelligence

Current Provider

- Google Gemini

Future Providers

- OpenAI
- Claude
- OpenRouter
- DeepSeek
- Qwen

The AI provider can be replaced without affecting the rest of the system.

---

# Telegram Deployment

Platform

- Telegram Bot API

The Telegram Bot communicates with the backend using webhooks.

Flow

```
User

↓

Telegram

↓

Webhook

↓

Backend

↓

Firestore
```

---

# Source Code

Repository Structure

```
discipline-ai/

├── frontend/

├── backend/

├── shared/

└── docs/
```

GitHub serves as the single source of truth.

---

# Environment Variables

## Frontend

```
NEXT_PUBLIC_API_URL

NEXT_PUBLIC_FIREBASE_API_KEY

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN

NEXT_PUBLIC_FIREBASE_PROJECT_ID

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID

NEXT_PUBLIC_FIREBASE_APP_ID
```

---

## Backend

```
PORT

NODE_ENV

FIREBASE_PROJECT_ID

FIREBASE_CLIENT_EMAIL

FIREBASE_PRIVATE_KEY

JWT_SECRET

GEMINI_API_KEY

TELEGRAM_BOT_TOKEN

TELEGRAM_WEBHOOK_SECRET

FRONTEND_URL
```

---

# CI/CD

Deployment should be automatic.

Workflow

```
Git Push

↓

GitHub

↓

Automatic Build

↓

Tests

↓

Deployment

↓

Production
```

Frontend and backend should deploy independently.

---

# Deployment Flow

```
Developer

↓

GitHub

↓

Push Code

↓

Vercel Build

↓

Frontend Live
```

```
Developer

↓

GitHub

↓

Push Code

↓

Railway Build

↓

Backend Live
```

---

# Production URLs

Example

Frontend

```
https://discipline-ai.vercel.app
```

Backend

```
https://api.discipline-ai.com
```

API

```
https://api.discipline-ai.com/api/v1
```

---

# Security

Production deployment should include

- HTTPS only
- Environment variables
- JWT authentication
- Secure webhook validation
- Firebase Security Rules
- API rate limiting
- Input validation
- CORS protection

Secrets must never be committed to Git.

---

# Monitoring

The production system should monitor

- API uptime
- Backend errors
- Telegram failures
- AI failures
- Scheduler failures
- Authentication errors

Future monitoring tools

- Sentry
- Better Stack
- Google Analytics

---

# Logging

Backend logs should include

- API requests
- Errors
- Scheduler execution
- AI requests
- Telegram events

Sensitive information must never be logged.

---

# Backup Strategy

Firestore provides managed storage.

Recommended backups

- Daily Firestore export
- Weekly report backup
- Configuration backup
- Environment variable backup

Critical data should always be recoverable.

---

# Scalability

The MVP is designed as a modular monolith.

Future scaling may separate

- API Service
- Analytics Service
- AI Service
- Notification Service
- Scheduler Service

The deployment architecture should support this transition without major redesign.

---

# Future Infrastructure

As the platform grows, future services may include

- Redis
- Cloud Storage
- BigQuery
- CDN
- Queue System
- Monitoring Platform
- Kubernetes
- Load Balancer

These are not required for the MVP.

---

# Deployment Checklist

Before every production deployment

- Build passes successfully
- Environment variables configured
- API endpoints verified
- Firebase connected
- Telegram webhook active
- AI provider configured
- Authentication working
- Scheduler running
- Security rules deployed
- No secrets committed

---

# Design Principles

Deployment follows these principles

- Independent services
- Secure communication
- Environment-based configuration
- Automated deployment
- Scalable architecture
- Reliable infrastructure
- Easy rollback
- Minimal downtime

---

# Summary

Discipline AI is deployed using a modern cloud architecture.

The frontend is hosted on Vercel, the backend on Railway, and behavioural data is stored in Firebase Firestore.

The backend acts as the central orchestrator, coordinating authentication, analytics, AI processing and Telegram integration.

This deployment strategy provides a secure, scalable and production-ready foundation while remaining simple enough for rapid MVP development.