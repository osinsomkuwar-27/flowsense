# FlowSense — AI-Powered DevOps Monitoring

FlowSense is a DevOps pipeline monitoring and optimization dashboard that automatically aggregates metrics, issues, and activities from GitHub, Jira, and Notion. It detects process anomalies in real-time and provides AI-generated optimization workflows to resolve bottlenecks before they impact delivery.

---

## ⚙️ How It Works

FlowSense connects development activities and project management updates into a unified event stream:

1. **Ingestion & Webhooks**: Backend schedulers poll third-party APIs (GitHub, Jira, Notion) at set intervals. Additionally, the server exposes webhook listeners to ingest pushed actions instantly.
2. **Standardization & Persistence**: Raw events are normalized into standard formats, parsed, and persisted inside a local SQLite database using Prisma.
3. **Anomaly Analysis & AI Workflows**: The normalized event stream is consumed by an anomaly detection engine. When process anomalies are found, context is compiled and sent to the AI optimization engine to generate interactive workflow resolution graphs and SVG flowcharts.
4. **Interactive Execution**: Authenticated users access the Next.js dashboard console to review the generated workflows and trigger automated action execution steps directly.

---

## 🛠️ Getting Started

### 1. Start the Backend Server (Express + Prisma + SQLite)

First, navigate to the `backend` folder, install the dependencies, apply database migrations, and run the server:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

The backend server runs on `http://localhost:4000`.

### 2. Configure Environment Variables (`backend/.env`)

Before starting the server, verify or create a `.env` file inside the `backend` folder to configure the SQLite database path and integration settings (credentials fallback to built-in development mocks if left blank):

```ini
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-session-jwt-secret"

# Optional integrations configuration
GITHUB_TOKEN=your_github_token
GITHUB_ORG=your_github_org
GITHUB_REPOS=repo1,repo2
JIRA_BASE_URL=https://your-org.atlassian.net
JIRA_EMAIL=dev@flowsense.io
JIRA_API_TOKEN=your_jira_token
JIRA_PROJECT_KEYS=PROJ1
NOTION_TOKEN=secret_your_token
NOTION_DATABASE_IDS=db1
```

### 3. Start the Frontend App (Next.js)

Navigate to the `frontend` folder, install the dependencies, and start the development app:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` to view the dashboard console.