"use client"

import { motion } from "framer-motion"
import { Users, Zap, FileCheck, Handshake, Activity } from "lucide-react"
import { useEffect, useState } from "react"

const stats = [
  {
    icon: Users,
    label: "Active Users",
    value: 12847,
    suffix: "+",
    color: "text-primary",
  },
  {
    icon: Zap,
    label: "Ongoing Hackathons",
    value: 48,
    suffix: "",
    color: "text-chart-2",
  },
  {
    icon: Activity,
    label: "AI Tasks Processed",
    value: 1247893,
    suffix: "",
    color: "text-chart-3",
  },
  {
    icon: Handshake,
    label: "Collaborations Formed",
    value: 3421,
    suffix: "+",
    color: "text-chart-4",
  },
  {
    icon: FileCheck,
    label: "Submissions Reviewed",
    value: 28456,
    suffix: "",
    color: "text-chart-5",
  },
]

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * value))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [value, duration])

  return <span>{count.toLocaleString()}</span>
}

export function LiveAnalyticsSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <span className="text-primary text-sm font-medium uppercase tracking-wider">Live Data</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ecosystem <span className="text-primary glow-text">Analytics</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time insights into our growing innovation network
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 text-center group"
            >
              <div className="inline-flex p-3 rounded-xl bg-primary/10 border border-primary/20 mb-4 group-hover:glow-border transition-all">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`text-3xl font-bold mb-1 ${stat.color}`}>
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Activity Graph Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 glass-card p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Ecosystem Activity</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-2" />
                <span className="text-muted-foreground">Submissions</span>
              </div>
            </div>
          </div>
          <div className="h-48 flex items-end gap-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-primary/20 rounded-t-sm overflow-hidden"
                initial={{ height: 0 }}
                whileInView={{ height: `${20 + Math.random() * 80}%` }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="w-full bg-primary"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${30 + Math.random() * 70}%` }}
                  transition={{ duration: 0.7, delay: i * 0.05 + 0.2 }}
                  viewport={{ once: true }}
                />
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>24:00</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
