"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Users, Shield, Brain, BarChart3, Sparkles, Activity, Cpu, Network } from "lucide-react"
import { useEffect, useState } from "react"
import { AIProcessingLogs } from "@/components/ecosystem/ai-processing-logs"

const agents = [
  {
    name: "Team Formation Agent",
    description: "AI-powered team matching based on skills and compatibility",
    icon: Users,
    status: "Active",
    tasks: 156,
    logs: ["Analyzing user profiles...", "Matching skills...", "Found 3 compatible teams"],
  },
  {
    name: "Review Agent",
    description: "Automated submission review and scoring",
    icon: Brain,
    status: "Processing",
    tasks: 89,
    logs: ["Scanning code quality...", "Running security checks...", "Generating feedback"],
  },
  {
    name: "Security Agent",
    description: "Real-time threat detection and prevention",
    icon: Shield,
    status: "Active",
    tasks: 234,
    logs: ["Monitoring traffic...", "All systems secure", "Threat level: Low"],
  },
  {
    name: "Mentor Agent",
    description: "Personalized guidance and recommendations",
    icon: Sparkles,
    status: "Active",
    tasks: 67,
    logs: ["Loading learning paths...", "Customizing roadmap...", "Ready to assist"],
  },
  {
    name: "Analytics Agent",
    description: "Deep insights and performance tracking",
    icon: BarChart3,
    status: "Active",
    tasks: 445,
    logs: ["Aggregating metrics...", "Generating reports...", "Insights updated"],
  },
]

export function AIAgentsSection() {
  const [agentStates, setAgentStates] = useState(
    agents.map(() => ({ logIndex: 0, taskCount: 0, isProcessing: false }))
  )
  const [activeConnections, setActiveConnections] = useState<number[]>([])
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null)

  // Simulate agent activity
  useEffect(() => {
    const interval = setInterval(() => {
      setAgentStates((prev) =>
        prev.map((state, i) => ({
          logIndex: (state.logIndex + 1) % agents[i].logs.length,
          taskCount: state.taskCount + Math.floor(Math.random() * 3),
          isProcessing: Math.random() > 0.7,
        }))
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  // Simulate connections between agents
  useEffect(() => {
    const interval = setInterval(() => {
      const newConnections = []
      for (let i = 0; i < 3; i++) {
        if (Math.random() > 0.5) {
          newConnections.push(Math.floor(Math.random() * agents.length))
        }
      }
      setActiveConnections(newConnections)
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  return (
    <section id="ecosystem" className="relative py-32 overflow-hidden">
      {/* Cyber grid background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6"
          >
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-primary text-sm font-medium">Autonomous Intelligence</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-primary glow-text">AI Agent</span> Ecosystem
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Autonomous agents working together to power your innovation journey
          </p>
        </motion.div>

        <div className="relative">
          {/* Central hub visualization */}
          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-[500px] h-[500px]"
            >
              <svg className="w-full h-full" viewBox="0 0 500 500">
                <circle
                  cx="250"
                  cy="250"
                  r="200"
                  fill="none"
                  stroke="rgba(74, 222, 128, 0.1)"
                  strokeWidth="1"
                  strokeDasharray="10 5"
                />
              </svg>
            </motion.div>

            {/* Connection lines to agents */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
              {agents.map((_, i) => {
                const angle = ((i * 72) - 90) * (Math.PI / 180)
                const endX = 250 + Math.cos(angle) * 180
                const endY = 250 + Math.sin(angle) * 180
                const isActive = activeConnections.includes(i)

                return (
                  <g key={i}>
                    <line
                      x1="250"
                      y1="250"
                      x2={endX}
                      y2={endY}
                      stroke={isActive ? "rgb(74, 222, 128)" : "rgba(74, 222, 128, 0.2)"}
                      strokeWidth={isActive ? "2" : "1"}
                      className={isActive ? "animate-pulse" : ""}
                    />
                    {isActive && (
                      <motion.circle
                        r="4"
                        fill="rgb(74, 222, 128)"
                        initial={{ cx: 250, cy: 250 }}
                        animate={{ cx: endX, cy: endY }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      />
                    )}
                  </g>
                )
              })}
            </svg>

            {/* Central core */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center glow-border"
            >
              <Network className="w-8 h-8 text-primary" />
            </motion.div>
          </div>

          {/* Agent cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {agents.map((agent, index) => {
              const state = agentStates[index]
              const isHovered = hoveredAgent === index

              return (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onHoverStart={() => setHoveredAgent(index)}
                  onHoverEnd={() => setHoveredAgent(null)}
                  className="glass-card p-6 glow-border cursor-pointer group relative overflow-hidden"
                >
                  {/* Processing overlay */}
                  <AnimatePresence>
                    {state.isProcessing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-primary/5 pointer-events-none"
                      >
                        <motion.div
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      animate={state.isProcessing ? { rotate: 360 } : {}}
                      transition={{ duration: 2, repeat: state.isProcessing ? Infinity : 0, ease: "linear" }}
                      className="p-3 rounded-lg bg-primary/10 border border-primary/20"
                    >
                      <agent.icon className="w-6 h-6 text-primary" />
                    </motion.div>
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                      </span>
                      <span className="text-xs text-primary">{agent.status}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{agent.description}</p>

                  {/* Live log display */}
                  <div className="h-6 overflow-hidden mb-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={state.logIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xs font-mono text-primary/80 flex items-center gap-2"
                      >
                        <Activity className="w-3 h-3" />
                        {agent.logs[state.logIndex]}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Tasks Processed</span>
                    <motion.span
                      key={state.taskCount}
                      initial={{ scale: 1.2, color: "rgb(74, 222, 128)" }}
                      animate={{ scale: 1, color: "rgb(74, 222, 128)" }}
                      className="font-mono"
                    >
                      {(agent.tasks + state.taskCount).toLocaleString()}
                    </motion.span>
                  </div>

                  <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(((agent.tasks + state.taskCount) / 500) * 100, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>

                  {/* Expanded view on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-border overflow-hidden"
                      >
                        <div className="text-xs text-muted-foreground mb-2">Recent Activity</div>
                        <div className="space-y-1 font-mono text-[10px]">
                          {agent.logs.map((log, i) => (
                            <div key={i} className="flex items-center gap-2 text-muted-foreground/70">
                              <span className="text-primary">●</span>
                              {log}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Live Processing Logs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Live AI Processing</h3>
            <span className="relative flex h-2 w-2 ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </div>
          <AIProcessingLogs maxLogs={4} />
        </motion.div>
      </div>
    </section>
  )
}
