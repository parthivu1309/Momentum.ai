# Database Design

**Project Name:** Discipline AI

**Version:** 1.0

**Database:** Firebase Firestore

---

# Overview

Discipline AI uses **Firebase Firestore** as its primary database for the MVP.

Firestore is a NoSQL document database designed for high scalability, low latency and real-time synchronization.

The database stores behavioural events rather than relational data.

Instead of complex joins, documents are designed to be easily queried by the application.

Business logic must never exist inside Firestore.

Firestore is responsible only for persistent storage.

---

# Database Philosophy

The database follows these principles.

- Store behavioural events.
- Keep documents small.
- Avoid unnecessary nesting.
- Duplicate small pieces of data when it improves query performance.
- Never rely on joins.
- Design for read performance.
- Analytics should read behaviour, not modify it.

---

# Collections Overview

```
users/

timetables/

tasks/

taskResponses/

dailyReports/

weeklyReports/

monthlyReports/

aiInsights/

notificationLogs/

userSettings/
```

Every collection has a single responsibility.

---

# Collection: users

Stores user profile information.

## Document ID

```
userId
```

## Fields

```ts
{
  uid: string
  name: string
  email: string
  photoURL?: string

  telegramId?: string

  timezone: string

  createdAt: Timestamp

  updatedAt: Timestamp

  lastLoginAt: Timestamp
}
```

Responsibilities

- User identity
- Authentication metadata
- Telegram connection
- Timezone
- Basic profile

---

# Collection: timetables

Stores user timetable.

Each user owns one active timetable.

## Document ID

```
timetableId
```

## Fields

```ts
{
  timetableId: string

  userId: string

  title: string

  isActive: boolean

  createdAt: Timestamp

  updatedAt: Timestamp
}
```

---

# Collection: tasks

Stores every scheduled task.

Tasks are created from the timetable.

## Document ID

```
taskId
```

## Fields

```ts
{
  taskId: string

  userId: string

  timetableId: string

  title: string

  description: string

  startTime: string

  endTime: string

  repeatType: "daily"

  order: number

  createdAt: Timestamp

  updatedAt: Timestamp
}
```

Example

```
Study DSA

08:00

09:30
```

---

# Collection: taskResponses

This is the most important collection.

Every user interaction creates one response document.

Each document represents behavioural evidence.

## Document ID

```
responseId
```

## Fields

```ts
{
  responseId: string

  userId: string

  taskId: string

  date: string

  status: "completed" | "missed" | "snoozed"

  reason: string | null

  completedAt: Timestamp | null

  responseTime: Timestamp

  notificationId: string
}
```

Examples

Completed

Missed

Snoozed

Skipped

Late Completion

---

# Collection: dailyReports

Stores generated daily reports.

## Fields

```ts
{
  reportId: string

  userId: string

  date: string

  analyticsSnapshot: object

  aiSummary: string

  createdAt: Timestamp
}
```

---

# Collection: weeklyReports

Stores weekly summaries.

```ts
{
  reportId: string

  userId: string

  weekNumber: number

  analyticsSnapshot: object

  aiSummary: string

  createdAt: Timestamp
}
```

---

# Collection: monthlyReports

Stores monthly reports.

```ts
{
  reportId: string

  userId: string

  month: number

  year: number

  analyticsSnapshot: object

  aiSummary: string

  createdAt: Timestamp
}
```

---

# Collection: aiInsights

Stores reusable AI observations.

These are shorter than reports.

Example

```
Morning productivity increased by 18%.
```

Fields

```ts
{
  insightId: string

  userId: string

  type: string

  message: string

  priority: string

  createdAt: Timestamp
}
```

---

# Collection: notificationLogs

Stores every notification sent.

Used for debugging and analytics.

Fields

```ts
{
  notificationId: string

  userId: string

  taskId: string

  sentAt: Timestamp

  status: string

  telegramMessageId: string
}
```

---

# Collection: userSettings

Stores user preferences.

Fields

```ts
{
  userId: string

  notificationEnabled: boolean

  reminderBeforeMinutes: number

  timezone: string

  darkMode: boolean
}
```

---

# Collection Relationships

```
User

│

├── Timetable

│

├── Tasks

│

├── Task Responses

│

├── Reports

│

├── AI Insights

│

├── Notification Logs

│

└── User Settings
```

Although Firestore has no foreign keys, every document stores its parent ID.

---

# Data Flow

```
User creates timetable

↓

Tasks created

↓

Notification sent

↓

User responds

↓

Task Response stored

↓

Analytics generated

↓

AI Summary generated

↓

Report stored
```

---

# Firestore Indexing

Composite indexes should be created for frequently queried fields.

Recommended indexes

```
userId + date

userId + status

userId + createdAt

userId + weekNumber

userId + month

taskId + date
```

Avoid unnecessary indexes.

---

# Query Strategy

The application should always query by user.

Examples

Good

```
Get today's responses for one user.

Get this week's reports.

Get active timetable.

Get all tasks ordered by startTime.
```

Avoid queries that scan the entire database.

---

# Document Size

Keep documents below Firestore limits.

Do not store

- long AI conversations
- logs
- unnecessary history

Large historical datasets should be split into multiple documents.

---

# Security Rules Philosophy

Every authenticated user should only access their own documents.

Rules should verify

```
request.auth.uid == resource.data.userId
```

The backend should remain the primary layer for business logic.

---

# Future Database Evolution

As the application grows, Firestore can continue to store operational data while specialised systems handle analytics.

Possible future additions include:

- BigQuery for large-scale behavioural analysis
- Cloud Storage for exported reports
- Redis for caching
- Event streaming for asynchronous processing

The data model is designed so these additions can be introduced without changing the core collections.

---

# Summary

Firestore stores raw behavioural data generated by user interactions.

The database is intentionally simple.

It does not calculate analytics.

It does not generate reports.

It does not perform AI reasoning.

Its responsibility is to provide reliable, scalable storage for behavioural events, reports and user data while the backend handles analytics and the AI layer provides personalised coaching.