"use client"

import { useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  pulse: number
  pulseSpeed: number
}

interface DataStream {
  startX: number
  startY: number
  endX: number
  endY: number
  progress: number
  speed: number
  active: boolean
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const dataStreamsRef = useRef<DataStream[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | null>(null)

  const initParticles = useCallback((width: number, height: number) => {
    const particleCount = Math.floor((width * height) / 15000)
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }))

    // Initialize data streams
    dataStreamsRef.current = Array.from({ length: 5 }, () => ({
      startX: Math.random() * width,
      startY: Math.random() * height,
      endX: Math.random() * width,
      endY: Math.random() * height,
      progress: 0,
      speed: Math.random() * 0.01 + 0.005,
      active: true,
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles(canvas.width, canvas.height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "rgba(74, 222, 128, 0.03)"
      ctx.lineWidth = 0.5
      const gridSize = 50
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Update pulse
        particle.pulse += particle.pulseSpeed
        const pulseOpacity = particle.opacity + Math.sin(particle.pulse) * 0.2

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          const force = (150 - dist) / 150
          particle.vx -= (dx / dist) * force * 0.02
          particle.vy -= (dy / dist) * force * 0.02
        }

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Damping
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        )
        gradient.addColorStop(0, `rgba(74, 222, 128, ${pulseOpacity})`)
        gradient.addColorStop(1, "rgba(74, 222, 128, 0)")
        
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(74, 222, 128, ${pulseOpacity})`
        ctx.fill()

        // Draw connections
        particlesRef.current.slice(i + 1).forEach((other) => {
          const ox = particle.x - other.x
          const oy = particle.y - other.y
          const distance = Math.sqrt(ox * ox + oy * oy)

          if (distance < 120) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(74, 222, 128, ${0.15 * (1 - distance / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      // Draw data streams
      dataStreamsRef.current.forEach((stream) => {
        if (!stream.active) return

        stream.progress += stream.speed
        if (stream.progress >= 1) {
          stream.progress = 0
          stream.startX = stream.endX
          stream.startY = stream.endY
          stream.endX = Math.random() * canvas.width
          stream.endY = Math.random() * canvas.height
        }

        const currentX = stream.startX + (stream.endX - stream.startX) * stream.progress
        const currentY = stream.startY + (stream.endY - stream.startY) * stream.progress

        // Draw stream trail
        const trailLength = 0.15
        const trailStart = Math.max(0, stream.progress - trailLength)
        const trailStartX = stream.startX + (stream.endX - stream.startX) * trailStart
        const trailStartY = stream.startY + (stream.endY - stream.startY) * trailStart

        const gradient = ctx.createLinearGradient(trailStartX, trailStartY, currentX, currentY)
        gradient.addColorStop(0, "rgba(74, 222, 128, 0)")
        gradient.addColorStop(1, "rgba(74, 222, 128, 0.6)")

        ctx.beginPath()
        ctx.moveTo(trailStartX, trailStartY)
        ctx.lineTo(currentX, currentY)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw head glow
        ctx.beginPath()
        ctx.arc(currentX, currentY, 4, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(74, 222, 128, 0.8)"
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [initParticles])

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  )
}
