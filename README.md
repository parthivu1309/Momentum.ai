Momentum AI 🚀

An AI-powered discipline coach that transforms your daily routine into actionable insights through intelligent analysis, Telegram reminders, and behavioural reports.

Momentum AI is not just another habit tracker. It is an AI Behaviour Intelligence Platform that helps users understand why they succeed or fail by analysing task completion patterns, productivity trends, and daily consistency.

✨ Features
📅 Smart Task Scheduling
Create daily schedules through a modern web interface.
Support for recurring tasks.
Flexible repeat options.
Real-time task management.
🤖 AI Behaviour Analysis
AI-generated daily reports.
AI-generated weekly reports.
Behavioural pattern recognition.
Evidence-based recommendations.
Productivity analysis.
Discipline scoring.
📲 Telegram Integration
Automatic task reminders.
Interactive buttons:
✅ Completed
❌ Missed
Instant response recording.
Real-time progress tracking.
📊 Analytics Dashboard
Daily completion rate.
Weekly performance.
Discipline score.
Completion statistics.
Behaviour insights.
AI-generated summaries.
☁️ Cloud Backend
Firestore database.
Scheduled task execution.
REST API.
AI service integration.
Automatic report generation.
🛠 Tech Stack
Frontend
Next.js
TypeScript
Tailwind CSS
React
Axios
Backend
NestJS
TypeScript
Firebase Firestore
Scheduler (Cron)
OpenRouter AI API
AI
OpenRouter
Markdown Report Generation
JSON Analysis
Custom Momentum AI System Prompt
Notifications
Telegram Bot API
Deployment
Frontend → Vercel
Backend → Render
Database → Firebase Firestore
📸 Workflow
Create Tasks
      │
      ▼
Firestore Database
      │
      ▼
Scheduler Checks Every Minute
      │
      ▼
Telegram Reminder
      │
      ▼
User Clicks
Completed / Missed
      │
      ▼
Firestore Updates
      │
      ▼
AI Analyses Behaviour
      │
      ▼
Daily / Weekly Report
🧠 AI Capabilities

Momentum AI analyses:

Task completion
Missed tasks
Consistency
Daily productivity
Behaviour trends
Habit strength
Weakest routines
Completion percentage
Discipline score
Personalised recommendations

Unlike traditional habit trackers, Momentum AI explains why progress is improving or declining instead of simply displaying statistics.

📂 Project Structure
frontend/
│
├── app/
├── components/
├── services/
├── hooks/
└── utils/

backend/
│
├── src/
│   ├── ai/
│   ├── scheduler/
│   ├── telegram/
│   ├── reports/
│   ├── tasks/
│   ├── firebase/
│   └── common/
│
└── ...
⚙️ Environment Variables
# OpenRouter

AI_API_KEY=
AI_BASE_URL=https://openrouter.ai/api/v1
AI_MODEL=

# Firebase

FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Telegram

TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Backend

PORT=3000
🚀 Local Setup
Clone
git clone https://github.com/YOUR_USERNAME/momentum-ai.git

cd momentum-ai
Backend
cd backend

npm install

npm run start:dev
Frontend
cd frontend

npm install

npm run dev
🧪 Example AI Report
# Daily Discipline Report

## Overview

Scheduled Tasks: 13

Completed: 10

Missed: 3

Completion Rate: 76.9%

Discipline Score: 82/100

## Key Insights

• Morning tasks show high consistency.

• Reading habit declined over the past week.

• Sleep schedule negatively impacts productivity.

## Recommendations

• Move reading before dinner.

• Sleep before 11 PM consistently.

• Maintain your current morning routine.
🔮 Future Roadmap
Streak tracking
Habit correlation analysis
Productivity heatmaps
Calendar integration
Google Calendar sync
Multi-user support
Mobile application
Voice reminders
AI chat assistant
Monthly reports
Smart scheduling suggestions
Performance forecasting
🤝 Contributing

Contributions, ideas, and feedback are always welcome.

Feel free to fork the repository, open an issue, or submit a pull request.

⭐ Support

If you found this project helpful, please consider giving it a ⭐ Star on GitHub.

It helps others discover the project and motivates future development.

👨‍💻 Author

Parthiv Upadhyay

Built with ❤️ using Next.js, NestJS, Firebase, Telegram, and AI.
