"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Users, Brain, Zap, Code, MessageSquare } from "lucide-react"

interface EcosystemNode {
  id: string
  type: "participant" | "ai-agent" | "project" | "collaboration"
  label: string
  x: number
  y: number
  status: "active" | "idle" | "processing"
}

interface DataFlow {
  id: string
  from: string
  to: string
  type: "recommendation" | "collaboration" | "data"
}

const initialNodes: EcosystemNode[] = [
  { id: "ai-team", type: "ai-agent", label: "Team Agent", x: 50, y: 30, status: "active" },
  { id: "ai-review", type: "ai-agent", label: "Review Agent", x: 80, y: 50, status: "processing" },
  { id: "ai-mentor", type: "ai-agent", label: "Mentor Agent", x: 20, y: 50, status: "active" },
  { id: "ai-analytics", type: "ai-agent", label: "Analytics", x: 50, y: 70, status: "active" },
  { id: "user-1", type: "participant", label: "Sarah C.", x: 30, y: 25, status: "active" },
  { id: "user-2", type: "participant", label: "Mike J.", x: 70, y: 25, status: "active" },
  { id: "user-3", type: "participant", label: "Elena R.", x: 15, y: 65, status: "idle" },
  { id: "user-4", type: "participant", label: "David K.", x: 85, y: 65, status: "active" },
  { id: "proj-1", type: "project", label: "AI Dashboard", x: 40, y: 45, status: "active" },
  { id: "proj-2", type: "project", label: "ML Pipeline", x: 60, y: 55, status: "processing" },
  { id: "collab-1", type: "collaboration", label: "Team Alpha", x: 35, y: 80, status: "active" },
  { id: "collab-2", type: "collaboration", label: "Team Beta", x: 65, y: 80, status: "active" },
]

const dataFlows: DataFlow[] = [
  { id: "f1", from: "ai-team", to: "user-1", type: "recommendation" },
  { id: "f2", from: "ai-team", to: "user-2", type: "recommendation" },
  { id: "f3", from: "user-1", to: "proj-1", type: "collaboration" },
  { id: "f4", from: "user-2", to: "proj-1", type: "collaboration" },
  { id: "f5", from: "ai-review", to: "proj-2", type: "data" },
  { id: "f6", from: "ai-mentor", to: "user-3", type: "recommendation" },
  { id: "f7", from: "proj-1", to: "collab-1", type: "collaboration" },
  { id: "f8", from: "ai-analytics", to: "collab-2", type: "data" },
]

export function EcosystemMap() {
  const [nodes, setNodes] = useState(initialNodes)
  const [activeFlows, setActiveFlows] = useState<string[]>([])
  const [notifications, setNotifications] = useState<{ id: string; x: number; y: number; text: string }[]>([])

  useEffect(() => {
    // Simulate random activity
    const activityInterval = setInterval(() => {
      // Toggle random node status
      setNodes((prev) =>
        prev.map((node) =>
          Math.random() > 0.85
            ? { ...node, status: node.status === "active" ? "processing" : "active" }
            : node
        )
      )

      // Activate random flow
      const randomFlow = dataFlows[Math.floor(Math.random() * dataFlows.length)]
      setActiveFlows((prev) => [...prev.slice(-3), randomFlow.id])
    }, 2000)

    // Random notifications
    const notificationInterval = setInterval(() => {
      const randomNode = nodes[Math.floor(Math.random() * nodes.length)]
      const notifications_text = [
        "New match found",
        "Analysis complete",
        "Syncing...",
        "Data updated",
        "Processing",
      ]
      setNotifications((prev) => [
        ...prev.slice(-2),
        {
          id: Math.random().toString(),
          x: randomNode.x,
          y: randomNode.y,
          text: notifications_text[Math.floor(Math.random() * notifications_text.length)],
        },
      ])
    }, 3000)

    return () => {
      clearInterval(activityInterval)
      clearInterval(notificationInterval)
    }
  }, [nodes])

  const getNodeIcon = (type: EcosystemNode["type"]) => {
    switch (type) {
      case "ai-agent":
        return Brain
      case "participant":
        return Users
      case "project":
        return Code
      case "collaboration":
        return MessageSquare
      default:
        return Zap
    }
  }

  const getNodeColor = (type: EcosystemNode["type"]) => {
    switch (type) {
      case "ai-agent":
        return "rgb(74, 222, 128)"
      case "participant":
        return "rgb(96, 165, 250)"
      case "project":
        return "rgb(251, 191, 36)"
      case "collaboration":
        return "rgb(244, 114, 182)"
      default:
        return "rgb(74, 222, 128)"
    }
  }

  return (
    <div className="relative w-full h-[400px] glass-card overflow-hidden">
      {/* Background grid */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(74, 222, 128, 0.05)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Data flows */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(74, 222, 128)" stopOpacity="0" />
            <stop offset="50%" stopColor="rgb(74, 222, 128)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(74, 222, 128)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {dataFlows.map((flow) => {
          const fromNode = nodes.find((n) => n.id === flow.from)
          const toNode = nodes.find((n) => n.id === flow.to)
          if (!fromNode || !toNode) return null

          const isActive = activeFlows.includes(flow.id)

          return (
            <g key={flow.id}>
              <line
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke="rgba(74, 222, 128, 0.1)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              {isActive && (
                <motion.circle
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{ duration: 1.5, ease: "linear" }}
                  r="3"
                  fill="rgb(74, 222, 128)"
                  style={{
                    offsetPath: `path('M ${(fromNode.x / 100) * 800} ${(fromNode.y / 100) * 400} L ${(toNode.x / 100) * 800} ${(toNode.y / 100) * 400}')`,
                  }}
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => {
        const Icon = getNodeIcon(node.type)
        const color = getNodeColor(node.type)

        return (
          <motion.div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: Math.random() * 0.5 }}
          >
            <motion.div
              className="relative"
              animate={node.status === "processing" ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: node.status === "processing" ? Infinity : 0 }}
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0 rounded-full blur-md"
                style={{
                  backgroundColor: color,
                  opacity: node.status === "active" ? 0.4 : 0.2,
                  transform: "scale(1.5)",
                }}
              />

              {/* Node */}
              <div
                className="relative w-10 h-10 rounded-full flex items-center justify-center border-2"
                style={{
                  backgroundColor: `${color}20`,
                  borderColor: color,
                  boxShadow: node.status === "active" ? `0 0 20px ${color}50` : "none",
                }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>

              {/* Status indicator */}
              {node.status === "active" && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: color }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-3 w-3"
                    style={{ backgroundColor: color }}
                  />
                </span>
              )}

              {/* Label */}
              <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[10px] font-medium text-muted-foreground">{node.label}</span>
              </div>
            </motion.div>
          </motion.div>
        )
      })}

      {/* Floating notifications */}
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            className="absolute px-2 py-1 rounded bg-primary/20 border border-primary/30 text-[10px] text-primary"
            style={{ left: `${notif.x}%`, top: `${notif.y - 10}%` }}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {notif.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-4 text-[10px]">
        {[
          { type: "ai-agent", label: "AI Agent" },
          { type: "participant", label: "Participant" },
          { type: "project", label: "Project" },
          { type: "collaboration", label: "Team" },
        ].map((item) => (
          <div key={item.type} className="flex items-center gap-1">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: getNodeColor(item.type as EcosystemNode["type"]) }}
            />
            <span className="text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
