"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface ChainNode {
  id: number
  x: number
  y: number
  size: number
  pulseDelay: number
}

interface ChainLink {
  from: number
  to: number
  animated: boolean
}

export function BlockchainVisualization({ className = "" }: { className?: string }) {
  const [nodes, setNodes] = useState<ChainNode[]>([])
  const [links, setLinks] = useState<ChainLink[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Generate deterministic chain nodes
    const generatedNodes: ChainNode[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 10 + (i % 4) * 28 + (Math.floor(i / 4) % 2) * 14,
      y: 15 + Math.floor(i / 4) * 30,
      size: 4 + (i % 3) * 2,
      pulseDelay: i * 0.2,
    }))

    // Generate chain links
    const generatedLinks: ChainLink[] = []
    for (let i = 0; i < generatedNodes.length - 1; i++) {
      if (i % 4 !== 3) {
        generatedLinks.push({ from: i, to: i + 1, animated: i % 2 === 0 })
      }
      if (i < 8) {
        generatedLinks.push({ from: i, to: i + 4, animated: i % 3 === 0 })
      }
    }

    setNodes(generatedNodes)
    setLinks(generatedLinks)
  }, [])

  if (!mounted) return null

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 120 100"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 10px rgba(34, 197, 94, 0.3))" }}
      >
        {/* Links */}
        {links.map((link, i) => {
          const fromNode = nodes[link.from]
          const toNode = nodes[link.to]
          if (!fromNode || !toNode) return null

          return (
            <motion.line
              key={`link-${i}`}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="rgba(34, 197, 94, 0.3)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          )
        })}

        {/* Animated data flow */}
        {links
          .filter((l) => l.animated)
          .map((link, i) => {
            const fromNode = nodes[link.from]
            const toNode = nodes[link.to]
            if (!fromNode || !toNode) return null

            return (
              <motion.circle
                key={`flow-${i}`}
                r="1"
                fill="#22c55e"
                initial={{ cx: fromNode.x, cy: fromNode.y, opacity: 0 }}
                animate={{
                  cx: [fromNode.x, toNode.x],
                  cy: [fromNode.y, toNode.y],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            )
          })}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            {/* Outer glow */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size + 2}
              fill="rgba(34, 197, 94, 0.1)"
              animate={{ r: [node.size + 2, node.size + 4, node.size + 2] }}
              transition={{
                duration: 2,
                delay: node.pulseDelay,
                repeat: Infinity,
              }}
            />
            {/* Node */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="rgba(34, 197, 94, 0.2)"
              stroke="#22c55e"
              strokeWidth="0.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: node.pulseDelay }}
            />
            {/* Inner dot */}
            <circle cx={node.x} cy={node.y} r="1" fill="#22c55e" />
          </g>
        ))}
      </svg>

      {/* Overlay text */}
      <div className="absolute bottom-2 left-2 text-[10px] text-primary/50 font-mono">
        CHAIN_ACTIVE
      </div>
    </div>
  )
}

export function TransactionPulse() {
  return (
    <div className="relative">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-primary/30"
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{
            duration: 2,
            delay: i * 0.6,
            repeat: Infinity,
          }}
        />
      ))}
      <div className="w-3 h-3 rounded-full bg-primary" />
    </div>
  )
}
