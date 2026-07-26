# API Design

**Project Name:** Discipline AI

**Version:** 1.0

**Architecture Style:** REST API

**Backend:** NestJS

---

# Overview

The Discipline AI backend exposes a REST API used by the web application, Telegram Bot and future mobile applications.

The API acts as the single entry point for every client.

Clients never communicate directly with Firebase.

All validation, authentication, analytics and AI operations pass through the backend.

---

# API Design Principles

The API follows these principles.

- RESTful architecture
- Resource based endpoints
- Stateless requests
- JWT authentication
- JSON request and response
- Consistent response format
- Proper HTTP status codes
- Versioned endpoints
- Backend owns all business logic

Base URL

```

/api/v1

```

---

# Authentication

Every protected request requires a valid authenticated user.

Public Routes

```

POST /auth/register

POST /auth/login

POST /auth/google

```

Protected Routes

Everything else.

---

# Standard Response Format

Every successful request should return

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "timestamp": "2026-01-01T10:00:00Z"
}
```

---

Error format

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [],
  "timestamp": "2026-01-01T10:00:00Z"
}
```

---

# Authentication Module

Base Route

```

/auth

```

Responsibilities

- Register
- Login
- Logout
- Verify token
- Current user

Endpoints

## Register

```

POST /auth/register

```

Creates a new user account.

---

## Login

```

POST /auth/login

```

Authenticates user.

---

## Google Login

```

POST /auth/google

```

Authenticate using Google.

---

## Current User

```

GET /auth/me

```

Returns authenticated user.

---

# User Module

Base Route

```

/users

```

Responsibilities

- Profile
- Settings
- Telegram Connection

Endpoints

```

GET /users/profile

PATCH /users/profile

DELETE /users/account

```

---

# Timetable Module

Base Route

```

/timetables

```

Responsibilities

Manage user's timetable.

Endpoints

Create timetable

```

POST /timetables

```

Get timetable

```

GET /timetables

```

Update timetable

```

PATCH /timetables/:id

```

Delete timetable

```

DELETE /timetables/:id

```

---

# Task Module

Base Route

```

/tasks

```

Responsibilities

Generate and manage scheduled tasks.

Endpoints

```

GET /tasks

GET /tasks/today

GET /tasks/upcoming

POST /tasks

PATCH /tasks/:id

DELETE /tasks/:id

```

---

# Task Response Module

Base Route

```

/responses

```

Responsibilities

Record user behaviour.

Every response represents behavioural evidence.

Endpoints

Submit response

```

POST /responses

```

Get today's responses

```

GET /responses/today

```

Get response history

```

GET /responses/history

```

---

# Analytics Module

Base Route

```

/analytics

```

Responsibilities

Generate deterministic behavioural metrics.

AI never performs these calculations.

Endpoints

Today's analytics

```

GET /analytics/today

```

Weekly analytics

```

GET /analytics/week

```

Monthly analytics

```

GET /analytics/month

```

Behaviour summary

```

GET /analytics/summary

```

Returns

- Completion rate
- Streak
- Productive hours
- Failure reasons
- Behaviour score

---

# Reports Module

Base Route

```

/reports

```

Responsibilities

Access generated reports.

Endpoints

```

GET /reports/daily

GET /reports/weekly

GET /reports/monthly

GET /reports/:id

```

Reports are generated automatically.

Clients never generate reports.

---

# AI Module

Base Route

```

/ai

```

Responsibilities

Generate behavioural coaching.

Endpoints

```

POST /ai/daily

POST /ai/weekly

POST /ai/monthly

```

These endpoints are intended for internal backend use.

The frontend should never directly trigger AI generation.

---

# Telegram Module

Base Route

```

/telegram

```

Responsibilities

Telegram integration.

Endpoints

Webhook

```

POST /telegram/webhook

```

Connect Telegram

```

POST /telegram/connect

```

Disconnect

```

DELETE /telegram/disconnect

```

Status

```

GET /telegram/status

```

---

# Scheduler Module

These endpoints are not public.

Responsibilities

- Send reminders
- Generate reports
- Weekly summaries
- Monthly summaries

They are triggered automatically through scheduled jobs.

---

# Notification Module

Responsibilities

Send notifications.

Future support

- Telegram
- Email
- Push Notifications
- WhatsApp

Current MVP

Telegram only.

---

# Request Lifecycle

A normal request follows this path.

```

Client

↓

Authentication

↓

Validation

↓

Controller

↓

Service

↓

Firestore

↓

Service

↓

Response

↓

Client

```

---

# Telegram Request Flow

```

Telegram User

↓

Telegram Bot

↓

Webhook

↓

NestJS

↓

Validation

↓

Firestore

↓

Analytics

↓

Response

```

---

# Daily Report Flow

```

Cron Job

↓

Collect Behaviour

↓

Analytics

↓

AI

↓

Save Report

↓

Dashboard

```

---

# Authentication Flow

```

Login

↓

Firebase Authentication

↓

JWT Verification

↓

NestJS Guard

↓

Protected Route

```

---

# API Versioning

All endpoints must be versioned.

Current version

```

/api/v1

```

Future versions

```

/api/v2

/api/v3

```

Older versions should remain functional until officially deprecated.

---

# HTTP Status Codes

Success

```

200 OK

201 Created

204 No Content

```

Client Errors

```

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

```

Server Errors

```

500 Internal Server Error

503 Service Unavailable

```

---

# Validation

Every request should be validated before reaching business logic.

Validation includes

- Required fields
- Data types
- Empty values
- Invalid dates
- Invalid times
- Duplicate timetable entries
- Authentication checks

---

# Security

Every request must satisfy

- Authenticated user
- Authorised access
- Valid payload
- Rate limiting
- Input validation

Users can never access another user's data.

---

# Future API Expansion

The API is intentionally modular.

Future modules may include

- Goals
- Mood Tracking
- Energy Tracking
- Calendar
- Google Fit
- Apple Health
- Wearables
- Team Productivity
- AI Chat
- Adaptive Scheduling

These modules should be added without changing existing endpoints.

---

# Summary

The REST API is the communication layer between every client and the backend.

It owns business logic, validation, authentication and orchestration.

Clients never communicate directly with Firestore or AI services.

The API remains stable while allowing new modules and integrations to be added as the product evolves.