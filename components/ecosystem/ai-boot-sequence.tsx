"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Brain, Cpu, Network, Zap } from "lucide-react"

export function AIBootSequence({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const bootSteps = [
    { icon: Cpu, text: "Initializing AI Core Systems...", duration: 800 },
    { icon: Network, text: "Establishing Neural Connections...", duration: 1000 },
    { icon: Brain, text: "Loading Intelligence Modules...", duration: 1200 },
    { icon: Zap, text: "Activating Ecosystem Services...", duration: 800 },
  ]

  useEffect(() => {
    if (phase >= bootSteps.length) {
      setIsComplete(true)
      setTimeout(() => onComplete?.(), 500)
      return
    }

    const duration = bootSteps[phase].duration
    const interval = 50
    const increment = 100 / (duration / interval)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          setPhase((p) => p + 1)
          return 0
        }
        return prev + increment
      })
    }, interval)

    return () => clearInterval(progressInterval)
  }, [phase, bootSteps.length, onComplete])

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 bg-background flex items-center justify-center"
      />
    )
  }

  const currentStep = bootSteps[phase] || bootSteps[bootSteps.length - 1]
  const Icon = currentStep.icon

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-8"
    >
      {/* Animated logo */}
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-2 border-primary/20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-primary/40 border-dashed"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center glow-border">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </motion.div>
      </div>

      {/* Boot text */}
      <div className="text-center">
        <motion.h2
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-primary glow-text"
        >
          Vissionary Nexus
        </motion.h2>
        <motion.p
          key={`text-${phase}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground mt-2"
        >
          {currentStep.text}
        </motion.p>
      </div>

      {/* Progress bar */}
      <div className="w-64">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Phase {phase + 1}/{bootSteps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Boot log */}
      <div className="font-mono text-xs text-muted-foreground/50 max-w-sm text-center">
        {bootSteps.slice(0, phase + 1).map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: i < phase ? 0.5 : 1 }}
            className="flex items-center gap-2 justify-center"
          >
            <span className={i < phase ? "text-primary" : "text-muted-foreground"}>
              {i < phase ? "✓" : "○"}
            </span>
            <span>{step.text.replace("...", "")}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
