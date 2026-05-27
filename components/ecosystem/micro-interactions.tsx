"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ReactNode, useRef } from "react"

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function MagneticButton({ children, className = "", onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    x.set(mouseX * 0.3)
    y.set(mouseY * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}

interface TiltCardProps {
  children: ReactNode
  className?: string
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { damping: 20, stiffness: 300 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)
  const rotateX = useTransform(ySpring, [-100, 100], [10, -10])
  const rotateY = useTransform(xSpring, [-100, 100], [-10, 10])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}

interface GlowingBorderProps {
  children: ReactNode
  className?: string
}

export function GlowingBorder({ children, className = "" }: GlowingBorderProps) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary/50 to-primary rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500 animate-pulse" />
      <div className="relative">{children}</div>
    </div>
  )
}

interface HolographicPanelProps {
  children: ReactNode
  className?: string
}

export function HolographicPanel({ children, className = "" }: HolographicPanelProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Holographic effect layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 rounded-xl" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(74,222,128,0.1)_50%,transparent_55%)] bg-[length:200%_200%] animate-shimmer rounded-xl" />
      <div className="absolute inset-0 backdrop-blur-xl rounded-xl" />
      <div className="absolute inset-[1px] bg-card/80 rounded-xl" />
      <div className="relative">{children}</div>
    </div>
  )
}

interface PulseRingProps {
  size?: number
  color?: string
  delay?: number
}

export function PulseRing({ size = 100, color = "rgb(74, 222, 128)", delay = 0 }: PulseRingProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: color }}
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{
            scale: [0.8, 1.5],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: delay + i * 0.6,
            ease: "easeOut",
          }}
        />
      ))}
      <div
        className="absolute inset-0 m-auto rounded-full"
        style={{
          width: size * 0.3,
          height: size * 0.3,
          backgroundColor: color,
          boxShadow: `0 0 20px ${color}`,
        }}
      />
    </div>
  )
}

interface FloatingElementProps {
  children: ReactNode
  amplitude?: number
  duration?: number
  delay?: number
}

export function FloatingElement({
  children,
  amplitude = 10,
  duration = 4,
  delay = 0,
}: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        rotate: [-2, 2, -2],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

interface DataStreamProps {
  direction?: "horizontal" | "vertical"
  className?: string
}

export function DataStream({ direction = "horizontal", className = "" }: DataStreamProps) {
  const isHorizontal = direction === "horizontal"

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className={`flex ${isHorizontal ? "gap-4" : "flex-col gap-2"}`}
        animate={{
          x: isHorizontal ? ["-100%", "0%"] : 0,
          y: isHorizontal ? 0 : ["-100%", "0%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="w-8 h-1 bg-primary rounded-full"
            style={{ opacity: Math.random() * 0.5 + 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  )
}
