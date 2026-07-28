<div align="center">
  <h1>🚀 Momentum AI</h1>
  <p>
    <b>An AI-powered discipline coach that transforms your daily routine into actionable insights through intelligent analysis, Telegram reminders, and behavioural reports.</b>
  </p>
  <p>
    Momentum AI is not just another habit tracker. It is an <b>AI Behaviour Intelligence Platform</b> that helps users understand why they succeed or fail by analysing task completion patterns, productivity trends, and daily consistency.
  </p>
</div>

<hr />

<h2>✨ Features</h2>

<h3>📅 Smart Task Scheduling</h3>
<ul>
  <li>Create daily schedules through a modern web interface.</li>
  <li>Support for recurring tasks.</li>
  <li>Flexible repeat options.</li>
  <li>Real-time task management.</li>
</ul>

<h3>🤖 AI Behaviour Analysis</h3>
<ul>
  <li>AI-generated daily reports.</li>
  <li>AI-generated weekly reports.</li>
  <li>Behavioural pattern recognition.</li>
  <li>Evidence-based recommendations.</li>
  <li>Productivity analysis.</li>
  <li>Discipline scoring.</li>
</ul>

<h3>📲 Telegram Integration</h3>
<ul>
  <li>Automatic task reminders.</li>
  <li>Interactive buttons:
    <ul>
      <li>✅ Completed</li>
      <li>❌ Missed</li>
    </ul>
  </li>
  <li>Instant response recording.</li>
  <li>Real-time progress tracking.</li>
</ul>

<h3>📊 Analytics Dashboard</h3>
<ul>
  <li>Daily completion rate.</li>
  <li>Weekly performance.</li>
  <li>Discipline score.</li>
  <li>Completion statistics.</li>
  <li>Behaviour insights.</li>
  <li>AI-generated summaries.</li>
</ul>

<h3>☁️ Cloud Backend</h3>
<ul>
  <li>Firestore database.</li>
  <li>Scheduled task execution.</li>
  <li>REST API.</li>
  <li>AI service integration.</li>
  <li>Automatic report generation.</li>
</ul>

<hr />

<h2>🛠 Tech Stack</h2>

<table>
  <tr>
    <th>Layer</th>
    <th>Technologies</th>
  </tr>
  <tr>
    <td><b>Frontend</b></td>
    <td>Next.js, TypeScript, Tailwind CSS, React, Axios</td>
  </tr>
  <tr>
    <td><b>Backend</b></td>
    <td>NestJS, TypeScript, Firebase Firestore, Scheduler (Cron)</td>
  </tr>
  <tr>
    <td><b>AI</b></td>
    <td>OpenRouter, Markdown Report Generation, JSON Analysis, Custom System Prompt</td>
  </tr>
  <tr>
    <td><b>Notifications</b></td>
    <td>Telegram Bot API</td>
  </tr>
  <tr>
    <td><b>Deployment</b></td>
    <td>Vercel (Frontend), Render (Backend), Firebase Firestore (Database)</td>
  </tr>
</table>

<hr />

<h2>📸 Workflow</h2>

<pre>
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
User Clicks (Completed / Missed)
      │
      ▼
Firestore Updates
      │
      ▼
AI Analyses Behaviour
      │
      ▼
Daily / Weekly Report
</pre>

<hr />

<h2>🧠 AI Capabilities</h2>

<p>Momentum AI analyses:</p>
<ul>
  <li>Task completion</li>
  <li>Missed tasks</li>
  <li>Consistency</li>
  <li>Daily productivity</li>
  <li>Behaviour trends</li>
  <li>Habit strength</li>
  <li>Weakest routines</li>
  <li>Completion percentage</li>
  <li>Discipline score</li>
  <li>Personalised recommendations</li>
</ul>
<p><i>Unlike traditional habit trackers, Momentum AI explains why progress is improving or declining instead of simply displaying statistics.</i></p>

<hr />

<h2>📂 Project Structure</h2>

<pre>
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
</pre>

<hr />

<h2>⚙️ Environment Variables</h2>

<pre><code># OpenRouter
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
</code></pre>

<hr />

<h2>🚀 Local Setup</h2>

<h3>Clone</h3>
<pre><code>git clone https://github.com/parthivu1309/Momentum.ai.git
cd momentum-ai
</code></pre>

<h3>Backend</h3>
<pre><code>cd backend
npm install
npm run start:dev
</code></pre>

<h3>Frontend</h3>
<pre><code>cd frontend
npm install
npm run dev
</code></pre>

<hr />

<h2>🧪 Example AI Report</h2>

<blockquote>
  <h3>Daily Discipline Report</h3>

  <h4>Overview</h4>
  <ul>
    <li>Scheduled Tasks: 13</li>
    <li>Completed: 10</li>
    <li>Missed: 3</li>
    <li>Completion Rate: 76.9%</li>
    <li>Discipline Score: 82/100</li>
  </ul>

  <h4>Key Insights</h4>
  <ul>
    <li>Morning tasks show high consistency.</li>
    <li>Reading habit declined over the past week.</li>
    <li>Sleep schedule negatively impacts productivity.</li>
  </ul>

  <h4>Recommendations</h4>
  <ul>
    <li>Move reading before dinner.</li>
    <li>Sleep before 11 PM consistently.</li>
    <li>Maintain your current morning routine.</li>
  </ul>
</blockquote>

<hr />

<h2>🔮 Future Roadmap</h2>
<ul>
  <li>[ ] Streak tracking</li>
  <li>[ ] Habit correlation analysis</li>
  <li>[ ] Productivity heatmaps</li>
  <li>[ ] Calendar integration (Google Calendar sync)</li>
  <li>[ ] Multi-user support</li>
  <li>[ ] Mobile application</li>
  <li>[ ] Voice reminders</li>
  <li>[ ] AI chat assistant</li>
  <li>[ ] Monthly reports</li>
  <li>[ ] Smart scheduling suggestions</li>
  <li>[ ] Performance forecasting</li>
</ul>

<hr />

<h2>🤝 Contributing</h2>
<p>Contributions, ideas, and feedback are always welcome.</p>
<p>Feel free to fork the repository, open an issue, or submit a pull request.</p>

<hr />

<h2>⭐ Support</h2>
<p>If you found this project helpful, please consider giving it a ⭐ <b>Star</b> on GitHub.</p>
<p>It helps others discover the project and motivates future development.</p>

<hr />

<h2>👨‍💻 Author</h2>
<p><b>Parthiv Upadhyay</b></p>
<p>Built with ❤️ using Next.js, NestJS, Firebase, Telegram, and AI.</p>
