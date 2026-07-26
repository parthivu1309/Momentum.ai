# Architecture

**Project Name:** Discipline AI

**Version:** 1.0

---

# Overview

Discipline AI follows a layered architecture where each layer has a single responsibility.

The project is designed to separate:

- Presentation
- Business Logic
- Data Storage
- Analytics
- Artificial Intelligence
- Notification System

This separation makes the application scalable, maintainable and easy to extend.

The MVP is intentionally designed as a modular monolith. Every feature is implemented as an independent module, making future migration to microservices straightforward.

---

# High Level Architecture

```
                    User
                     │
                     ▼
          Next.js Web Application
                     │
             HTTPS REST API
                     │
                     ▼
              NestJS Backend
                     │
      ┌──────────────┼──────────────┐
      │              │              │
      ▼              ▼              ▼
 Firebase      Analytics Layer   Telegram
 Firestore           │             Bot
      │              │
      └──────────────┘
             │
             ▼
         AI Service
     (Gemini/OpenRouter)
             │
             ▼
      AI Generated Reports
```

---

# Architecture Layers

## 1. Frontend Layer

Technology

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

Responsibilities

- User Interface
- Authentication
- Timetable Management
- Dashboard
- Reports
- Charts
- Settings

The frontend never performs business logic.

It only displays data received from the backend.

---

## 2. Backend Layer

Technology

- NestJS
- TypeScript

Responsibilities

- Authentication
- API
- Validation
- Business Logic
- Scheduling
- Report Generation
- Analytics
- AI Integration
- Telegram Integration

The backend acts as the central brain of the application.

Every request passes through this layer.

---

## 3. Database Layer

Technology

- Firebase Firestore

Responsibilities

Store:

- Users
- Timetables
- Tasks
- Task Responses
- Reports
- Notification Logs
- AI Insights
- User Settings

Firestore is treated purely as persistent storage.

Business logic should never exist inside the database.

---

## 4. Analytics Layer

The Analytics Layer is the most important component of the project.

Its responsibility is to convert raw behavioural events into meaningful metrics.

Examples

- Completion Rate
- Streaks
- Productivity Score
- Consistency
- Most Skipped Habit
- Most Common Excuse
- Productive Hours

The Analytics Layer never generates natural language.

It only generates structured data.

---

## 5. AI Layer

The AI Layer receives structured analytics instead of raw database records.

Responsibilities

- Daily Summary
- Weekly Summary
- Monthly Summary
- Behaviour Analysis
- Personalised Coaching
- Recommendations

AI must never calculate statistics.

AI must only interpret analytics.

---

## 6. Telegram Layer

The Telegram Bot is responsible for user interaction outside the web application.

Responsibilities

- Send reminders
- Receive responses
- Ask skip reasons
- Deliver reports
- Send motivational messages

The Telegram Bot should never contain business logic.

Every response is forwarded to the backend.

---

# Data Flow

The overall data flow is intentionally simple.

```
User

↓

Frontend

↓

REST API

↓

NestJS

↓

Firestore

↓

Analytics Engine

↓

AI Service

↓

Report

↓

Frontend / Telegram
```

---

# Notification Flow

```
Scheduler

↓

Task Time Reached

↓

Telegram Notification

↓

User Response

↓

Backend

↓

Firestore

↓

Analytics

↓

Dashboard Update
```

---

# Daily Report Flow

```
Midnight Scheduler

↓

Collect Today's Responses

↓

Run Analytics

↓

Generate Metrics

↓

Send Metrics to AI

↓

Generate Daily Report

↓

Store Report

↓

Display on Dashboard
```

---

# Weekly Report Flow

```
Sunday Scheduler

↓

Collect Week Data

↓

Analytics

↓

Behaviour Trends

↓

AI Summary

↓

Weekly Report

↓

Dashboard
```

---

# Project Structure

```
discipline-ai/

│

├── frontend/

│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── lib/
│   ├── types/
│   ├── utils/

│

├── backend/

│   ├── src/
│   │
│   ├── auth/
│   ├── users/
│   ├── timetable/
│   ├── tasks/
│   ├── analytics/
│   ├── reports/
│   ├── telegram/
│   ├── scheduler/
│   ├── ai/
│   ├── common/
│   └── config/

│

├── shared/

│   ├── types/
│   ├── constants/
│   └── interfaces/

│

├── docs/

│   ├── vision.md
│   ├── architecture.md
│   ├── database.md
│   ├── api.md
│   ├── ai.md
│   ├── telegram.md
│   ├── analytics.md
│   └── deployment.md

│

└── README.md
```

---

# Module Responsibilities

| Module | Responsibility |
|---------|----------------|
| Auth | User authentication and authorisation |
| Users | User profile and settings |
| Timetable | User schedule management |
| Tasks | Daily tasks generated from timetable |
| Telegram | Notifications and user responses |
| Scheduler | Cron jobs and background tasks |
| Analytics | Behaviour calculations |
| Reports | Daily, weekly and monthly reports |
| AI | Behaviour interpretation and coaching |

---

# Design Principles

The architecture follows these rules:

- Keep modules independent.
- Separate deterministic logic from AI reasoning.
- Store raw behavioural events.
- Generate analytics before AI.
- Keep the frontend presentation-only.
- Keep AI stateless.
- Minimise coupling between modules.
- Design every module for future scalability.

---

# Future Scalability

Although the MVP is built as a modular monolith, every module is designed so it can later become an independent microservice if required.

Possible future services include:

- Authentication Service
- Notification Service
- Analytics Service
- AI Service
- Reporting Service

No major redesign should be required for this transition.

---

# Summary

Discipline AI follows a layered architecture with clearly defined responsibilities.

Each layer has a single purpose:

- Frontend presents information.
- Backend manages business logic.
- Firestore stores behavioural data.
- Analytics transforms raw data into metrics.
- AI converts metrics into personalised coaching.
- Telegram provides a frictionless interaction channel.

This separation ensures the system remains maintainable, scalable and easy for future engineers or AI coding agents to understand.