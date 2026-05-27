"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const logEntries = [
  { type: "info", agent: "TeamAgent", message: "Analyzing user preferences..." },
  { type: "success", agent: "ReviewAgent", message: "Code analysis complete - Score: 94/100" },
  { type: "info", agent: "MentorAgent", message: "Generating personalized roadmap..." },
  { type: "success", agent: "AnalyticsAgent", message: "Real-time metrics updated" },
  { type: "warning", agent: "SecurityAgent", message: "Scanning submission integrity..." },
  { type: "info", agent: "TeamAgent", message: "Found 3 compatible matches" },
  { type: "success", agent: "MentorAgent", message: "Learning path optimized" },
  { type: "info", agent: "ReviewAgent", message: "Processing project submission..." },
  { type: "success", agent: "AnalyticsAgent", message: "Collaboration score: +15" },
  { type: "info", agent: "SecurityAgent", message: "All systems operational" },
]

interface LogEntry {
  type: string
  agent: string
  message: string
  id: string
  timestamp: string
}

export function AIProcessingLogs({ maxLogs = 5 }: { maxLogs?: number }) {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    const addLog = () => {
      const entry = logEntries[Math.floor(Math.random() * logEntries.length)]
      const newLog: LogEntry = {
        ...entry,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
      }
      setLogs((prev) => [...prev.slice(-(maxLogs - 1)), newLog])
    }

    addLog()
    const interval = setInterval(addLog, 2500)
    return () => clearInterval(interval)
  }, [maxLogs])

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-400"
      case "warning":
        return "text-yellow-400"
      case "error":
        return "text-red-400"
      default:
        return "text-primary"
    }
  }

  return (
    <div className="font-mono text-xs space-y-1 overflow-hidden">
      <AnimatePresence mode="popLayout">
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-2 py-1"
          >
            <span className="text-muted-foreground/50">{log.timestamp}</span>
            <span className={`${getTypeColor(log.type)} min-w-[100px]`}>[{log.agent}]</span>
            <span className="text-muted-foreground">{log.message}</span>
            {log.type === "info" && (
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-primary"
              >
                ...
              </motion.span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
