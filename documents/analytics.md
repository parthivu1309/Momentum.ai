# Analytics Engine

**Project Name:** Discipline AI

**Version:** 1.0

**Module:** Analytics

---

# Overview

The Analytics Engine is the core intelligence layer of Discipline AI.

Its responsibility is to transform raw behavioural events into structured, measurable insights.

The Analytics Engine is deterministic.

It does not use Artificial Intelligence.

It performs calculations, identifies patterns, and prepares structured summaries that are later interpreted by the AI layer.

---

# Purpose

The Analytics Engine exists to answer questions such as:

- How disciplined is the user?
- Which habits are most consistent?
- Which habits are frequently skipped?
- Which hours are most productive?
- What are the most common reasons for failure?
- How has behaviour changed over time?
- Which routines contribute most to success?

The output of this engine becomes the input for the AI.

---

# Analytics Pipeline

```
Behaviour Events

↓

Validation

↓

Aggregation

↓

Metric Calculation

↓

Pattern Detection

↓

Analytics Summary

↓

AI Layer

↓

Dashboard / Reports
```

---

# Input Data

The Analytics Engine consumes data from:

- Behaviour Events
- Timetable
- Tasks
- Notification Logs
- User Settings

It never communicates directly with the frontend.

---

# Behaviour Events

Every interaction with the Telegram Bot becomes a Behaviour Event.

Supported event types:

- COMPLETED
- MISSED
- SKIPPED
- SNOOZED

Each event contains:

- User
- Task
- Date
- Time
- Response
- Reason (if any)
- Response Time

These events are the foundation of all analytics.

---

# Responsibilities

The Analytics Engine is responsible for:

- Daily calculations
- Weekly calculations
- Monthly calculations
- Behaviour scoring
- Pattern detection
- Habit statistics
- Time-based analysis
- Report preparation

The Analytics Engine is NOT responsible for:

- AI coaching
- Notifications
- CRUD operations
- Authentication
- User Interface

---

# Daily Analytics

Calculated every day.

Metrics include:

- Total tasks
- Completed tasks
- Missed tasks
- Skipped tasks
- Snoozed tasks
- Completion Rate
- Discipline Score
- Response Rate
- Average Response Time
- Most Missed Task
- Most Common Failure Reason

---

# Weekly Analytics

Calculated every Sunday.

Metrics include:

- Weekly Completion Rate
- Longest Streak
- Average Daily Completion
- Best Day
- Worst Day
- Most Productive Hour
- Least Productive Hour
- Most Skipped Habit
- Most Common Excuse
- Behaviour Trend

---

# Monthly Analytics

Calculated on the first day of each month.

Metrics include:

- Monthly Completion Rate
- Monthly Discipline Score
- Habit Consistency
- Behaviour Changes
- Improvement Rate
- Regression Rate
- Best Performing Habit
- Weakest Habit
- Longest Streak
- Total Behaviour Events

---

# Core Metrics

The Analytics Engine calculates the following metrics.

## Completion Rate

```
Completed Tasks
--------------------
Scheduled Tasks
```

---

## Discipline Score

A score representing overall behavioural consistency.

The exact formula may evolve over time.

Factors include:

- Completion Rate
- Consistency
- Missed Tasks
- Snooze Frequency
- Skip Frequency

---

## Streak

Number of consecutive successful days.

Skipped tasks should not break a streak.

Missed tasks should.

---

## Habit Consistency

Measures how reliably a habit is completed over time.

Example:

```
Morning Walk

Completed

26 / 30 Days

Consistency

86%
```

---

## Productivity Hours

Determine which hours of the day produce the highest completion rates.

Example:

| Hour | Completion |
|------|-----------|
| 06:00 | 98% |
| 07:00 | 94% |
| 08:00 | 92% |
| 14:00 | 51% |
| 15:00 | 42% |

---

## Failure Reasons

Calculate frequency of each failure reason.

Example

| Reason | Count |
|---------|------|
| Phone | 16 |
| Low Energy | 12 |
| Unexpected Work | 8 |
| Forgot | 5 |
| Health | 3 |

This helps identify behavioural obstacles.

---

# Pattern Detection

The Analytics Engine should identify recurring behavioural patterns.

Examples

- Productive mornings
- Weak afternoons
- Weekend performance
- High snooze frequency
- Frequent phone distractions
- Consistent gym completion
- Study performance before lunch

Patterns are calculated using historical behaviour.

---

# Behaviour Trends

Track how user behaviour changes over time.

Examples

- Completion Rate increasing
- Discipline Score decreasing
- Reduced phone distractions
- Improved consistency
- Better sleep habits (future)
- Increased focus

These trends help measure improvement.

---

# Dashboard Analytics

The dashboard should display:

Today's Progress

Current Streak

Completion Rate

Discipline Score

Upcoming Tasks

Weekly Trend

Monthly Trend

Heatmap

Habit Consistency

Recent Insights

---

# AI Input

The Analytics Engine prepares structured summaries for the AI.

Example

```json
{
  "completionRate": 84,
  "disciplineScore": 89,
  "currentStreak": 12,
  "bestHour": "08:00",
  "worstHour": "15:00",
  "mostSkippedHabit": "Reading",
  "topFailureReason": "Phone",
  "weeklyTrend": "Improving"
}
```

The AI receives this summary instead of raw behaviour events.

---

# Report Generation

The Analytics Engine prepares data for:

- Daily Reports
- Weekly Reports
- Monthly Reports

Each report contains:

- Metrics
- Trends
- Behaviour Summary
- Structured Analytics

The AI later converts this into natural language.

---

# Future Analytics

Future versions may calculate:

- Mood Trends
- Energy Levels
- Focus Score
- Burnout Risk
- Goal Progress
- Sleep Quality
- Calendar Analysis
- Screen Time Correlation
- Wearable Data
- AI Coaching Effectiveness

The architecture should support these additions without redesign.

---

# Design Principles

The Analytics Engine follows these principles:

- Deterministic calculations only
- No Artificial Intelligence
- Evidence-based metrics
- Behaviour-first design
- High performance
- Scalable architecture
- Easy to extend
- Explainable outputs

---

# Summary

The Analytics Engine is the foundation of Discipline AI.

It transforms behavioural events into structured metrics that describe how a user behaves over time.

Rather than relying on AI to analyse raw data, the Analytics Engine performs all calculations, detects behavioural patterns, and prepares evidence-based summaries.

These summaries power the dashboard, reports, and AI coaching, making the system reliable, explainable, and scalable.