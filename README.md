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

### 2. Start the Frontend App (Next.js)

Navigate to the `frontend` folder, install the dependencies, and start the development app:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` to view the dashboard console.