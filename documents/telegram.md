# Telegram Integration

**Project Name:** Discipline AI

**Version:** 1.0

**Platform:** Telegram Bot API

---

# Overview

Telegram is the primary communication channel between Discipline AI and the user.

The bot is responsible for delivering reminders, collecting behavioural responses, and providing quick access to reports.

The Telegram Bot should never contain business logic.

It acts only as an interface.

Every user interaction is forwarded to the backend, where validation, analytics, storage, and AI processing take place.

---

# Objectives

The Telegram Bot exists to:

- Deliver scheduled reminders
- Collect user responses
- Minimise friction
- Increase consistency
- Reduce the need to open the web application
- Capture behavioural data in real time

The objective is to make interaction effortless.

---

# Responsibilities

The Telegram Bot is responsible for:

- Sending reminders
- Receiving user responses
- Asking skip reasons
- Displaying quick summaries
- Sending daily reports
- Sending weekly reports
- Showing current progress
- Connecting the user's Telegram account

The Telegram Bot is NOT responsible for:

- Business logic
- Analytics
- AI reasoning
- Authentication
- Database operations
- Scheduling calculations

---

# High-Level Architecture

```
Scheduler

↓

NestJS Backend

↓

Telegram Service

↓

Telegram Bot API

↓

User

↓

Telegram Bot API

↓

Webhook

↓

NestJS Backend

↓

Firestore

↓

Analytics
```

---

# Bot Commands

The following commands are available.

## /start

Initialises the bot.

Purpose

- Welcome user
- Explain the product
- Connect Telegram account

---

## /help

Displays available commands.

---

## /status

Shows today's progress.

Example

```
Today's Progress

Completed: 6

Remaining: 3

Completion Rate: 67%
```

---

## /report

Displays the latest daily or weekly report.

---

## /settings

Shows notification preferences.

Future versions may allow editing settings directly.

---

# Reminder Flow

The primary interaction flow.

```
Task Time

↓

Scheduler

↓

Backend

↓

Telegram Bot

↓

Reminder Sent

↓

User Response

↓

Backend

↓

Firestore

↓

Analytics
```

---

# Reminder Message

Example

```
Time to Study DSA

08:00 – 10:00

Have you completed it?
```

Buttons

```
✅ Yes

❌ No

⏰ Snooze

   skip today
```

---

# Response Flow

## YES

```
User

↓

Completed

↓

Backend

↓

Save Behaviour Event

↓

Update Dashboard
```

---

## NO

If the user selects **No**

The bot immediately asks

```
Why?
```

Buttons

```
Low Energy

Phone

Busy

Forgot

Unexpected Work

Health

Travelling

Other
```

Once selected

↓

Store Behaviour Event

↓

Confirmation Message

---

## SNOOZE

If Snooze is selected

Backend records

```
Status

Snooze Time

Timestamp
```

The Scheduler automatically sends another reminder after the configured interval.

---

# Behaviour Collection

Every interaction creates a behavioural event.

Examples

```
Task Completed

Task Missed

Task Snoozed

Skip Reason

Response Time
```

These events become the input for the Analytics Engine.

---

# Notification Types

The Telegram Bot sends several categories of notifications.

## Task Reminder

Regular scheduled reminder.

---

## Snooze Reminder

Sent after snooze duration expires.

---

## Daily Summary

Generated every night.

Contains

- Completion rate
- Tasks completed
- Tasks missed
- AI summary

---

## Weekly Report

Generated every Sunday.

Contains

- Weekly completion
- Behaviour trends
- AI recommendations

---

## Motivation

Optional motivational message.

Should only be sent occasionally.

Avoid excessive notifications.

---

# Notification Lifecycle

```
Task Created

↓

Scheduler

↓

Notification Sent

↓

Await User Response

↓

Response Stored

↓

Analytics Updated

↓

Dashboard Updated
```

---

# Webhook Flow

Telegram communicates using webhooks.

```
Telegram

↓

Webhook Endpoint

↓

Validation

↓

Controller

↓

Service

↓

Firestore

↓

Success Response
```

All incoming messages pass through the backend.

---

# State Management

The bot should support temporary conversation state.

Example

```
Reminder

↓

User presses No

↓

Waiting for Reason

↓

Reason Selected

↓

Conversation Complete
```

Conversation state should remain lightweight.

Long-term state belongs in Firestore.

---

# User Experience Principles

Interaction should be:

- Fast
- Minimal
- Clear
- One tap whenever possible

Users should never need to type unless absolutely necessary.

Buttons should always be preferred.

---

# Timezone Handling

Every reminder must respect the user's configured timezone.

The Scheduler converts all times before sending notifications.

Users in different countries should receive reminders at their local time.

---

# Failure Handling

If a notification cannot be delivered

The backend should

- Retry
- Log the failure
- Update notification status

Failures should never stop other scheduled notifications.

---

# Retry Strategy

Temporary failures

↓

Retry automatically

Permanent failures

↓

Log

↓

Notify monitoring

↓

Continue processing

The notification system should be fault tolerant.

---

# Analytics Events

Every Telegram interaction should generate an event.

Examples

```
Reminder Sent

Reminder Opened

Completed

Missed

Snoozed

Reason Selected

Response Time
```

Analytics should use these events to understand behaviour.

---

# Security

The bot should never expose

- Internal IDs
- Firebase information
- Authentication tokens
- AI prompts

Every webhook request should be validated before processing.

---

# Rate Limiting

The system should prevent

- Duplicate reminders
- Notification spam
- Excessive retries

Users should receive only meaningful notifications.

---

# Future Features

Future versions may include

- Voice responses
- Natural language replies
- Inline timetable editing
- AI conversation
- Quick goal updates
- Daily reflections
- Mood logging
- Energy tracking
- Photo attachments
- Calendar integration

The architecture should support these additions without major redesign.

---

# Design Principles

The Telegram Bot follows these principles.

- Telegram is an interface, not a backend.
- Every interaction creates behavioural data.
- Keep user effort minimal.
- Prefer buttons over typing.
- Keep conversations short.
- All business logic belongs to the backend.
- Analytics should consume behavioural events.
- AI should only generate reports and coaching.

---

# Summary

The Telegram Bot is the primary daily interaction channel for Discipline AI.

Its purpose is not simply to remind users about tasks, but to capture behavioural signals with as little friction as possible.

Every button press, reminder response, snooze action, and skip reason contributes to the user's behavioural history.

The backend transforms this behavioural data into analytics, and the AI layer converts those analytics into personalised coaching.

The Telegram Bot therefore acts as the bridge between user behaviour and behavioural intelligence.