import { Activity, AlertTriangle, GitBranch } from "lucide-react"

export const heroContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.28,
      delayChildren: 0.3,
    },
  },
}

export const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

export const featureRows = [
  {
    icon: Activity,
    title: "Events, pipelines, and anomalies stay connected",
    description:
      "The dashboard reflects the real shape of your workflows, so you can move from metrics to anomalies to root causes without losing context.",
  },
  {
    icon: AlertTriangle,
    title: "The overview tells you what actually needs attention",
    description:
      "See event volume, open anomalies, critical alerts, and pipeline health in one calmer view instead of assembling that picture manually.",
  },
  {
    icon: GitBranch,
    title: "Less tab-hopping, less mental overhead",
    description:
      "GitHub, Jira, and Notion events flow into a single timeline. Stop switching tools to understand what happened and why.",
  },
]
