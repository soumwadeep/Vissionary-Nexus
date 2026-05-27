"use client"

import { motion } from "framer-motion"
import { useEffect, useState, useMemo } from "react"

export function AIBrainVisualization() {
  const [pulsePhase, setPulsePhase] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Generate neural nodes - deterministic, no random values
  const nodes = useMemo(() => Array.from({ length: 24 }, (_, i) => {
    const layer = Math.floor(i / 8)
    const indexInLayer = i % 8
    const layerRadius = 80 + layer * 40
    const angle = (indexInLayer * 45 + layer * 15) * (Math.PI / 180)
    return {
      id: i,
      x: 150 + Math.cos(angle) * layerRadius,
      y: 150 + Math.sin(angle) * layerRadius,
      layer,
      delay: i * 0.1,
    }
  }), [])

  // Deterministic connections - using seeded pattern instead of random
  const connections = useMemo(() => {
    const conns: { from: number; to: number }[] = []
    nodes.forEach((node) => {
      nodes.forEach((other) => {
        if (other.layer === node.layer + 1) {
          // Use deterministic pattern: connect if sum of ids is even, or specific pattern
          const shouldConnect = (node.id + other.id) % 3 !== 0
          if (shouldConnect) {
            conns.push({ from: node.id, to: other.id })
          }
        }
      })
    })
    return conns
  }, [nodes])

  if (!mounted) {
    return (
      <div className="relative w-[300px] h-[300px] flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary animate-pulse" />
      </div>
    )
  }

  return (
    <div className="relative w-[300px] h-[300px]">
      {/* Outer rotating rings */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="1"
            strokeDasharray="8 12"
            opacity="0.3"
          />
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(74, 222, 128)" stopOpacity="0" />
              <stop offset="50%" stopColor="rgb(74, 222, 128)" stopOpacity="1" />
              <stop offset="100%" stopColor="rgb(74, 222, 128)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <circle
            cx="150"
            cy="150"
            r="120"
            fill="none"
            stroke="rgb(74, 222, 128)"
            strokeWidth="0.5"
            strokeDasharray="4 8"
            opacity="0.4"
          />
        </svg>
      </motion.div>

      {/* Neural network visualization */}
      <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgb(74, 222, 128)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(74, 222, 128)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connections */}
        {connections.map((conn, i) => {
          const from = nodes[conn.from]
          const to = nodes[conn.to]
          const pulseOffset = (pulsePhase + i * 20) % 100
          return (
            <g key={`conn-${conn.from}-${conn.to}`}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="rgb(74, 222, 128)"
                strokeWidth="0.5"
                opacity="0.2"
              />
              {/* Animated pulse along connection */}
              <circle
                cx={from.x + (to.x - from.x) * (pulseOffset / 100)}
                cy={from.y + (to.y - from.y) * (pulseOffset / 100)}
                r="2"
                fill="rgb(74, 222, 128)"
                opacity={0.8 - Math.abs(pulseOffset - 50) / 100}
              />
            </g>
          )
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pulseScale = 1 + Math.sin((pulsePhase + node.delay * 100) * (Math.PI / 180)) * 0.3
          return (
            <g key={`node-${node.id}`}>
              <circle
                cx={node.x}
                cy={node.y}
                r={8 * pulseScale}
                fill="url(#nodeGlow)"
                opacity="0.3"
              />
              <circle
                cx={node.x}
                cy={node.y}
                r={3}
                fill="rgb(74, 222, 128)"
                filter="url(#glow)"
              />
            </g>
          )
        })}

        {/* Central brain core */}
        <circle cx="150" cy="150" r="25" fill="url(#nodeGlow)" opacity="0.5" />
        <circle cx="150" cy="150" r="15" fill="rgb(74, 222, 128)" opacity="0.3" />
        <circle cx="150" cy="150" r="8" fill="rgb(74, 222, 128)" filter="url(#glow)" />
      </svg>

      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xs font-mono text-primary font-bold"
        >
          AI
        </motion.div>
      </div>
    </div>
  )
}
