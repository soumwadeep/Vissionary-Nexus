"use client"

import { motion } from "framer-motion"
import { UserPlus, User, Users, Trophy, Brain, Award } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    title: "Join Ecosystem",
    description: "Create your account and become part of the innovation network",
  },
  {
    icon: User,
    title: "Build Profile",
    description: "Showcase your skills, experience, and innovation interests",
  },
  {
    icon: Users,
    title: "AI Matches Teams",
    description: "Our AI forms optimal teams based on skills and compatibility",
  },
  {
    icon: Trophy,
    title: "Participate in Events",
    description: "Join hackathons, challenges, and innovation competitions",
  },
  {
    icon: Brain,
    title: "AI Reviews Progress",
    description: "Get real-time feedback and guidance from AI mentors",
  },
  {
    icon: Award,
    title: "Earn On-chain Reputation",
    description: "Build your blockchain-verified achievement portfolio",
  },
]

export function HowItWorksSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It <span className="text-primary glow-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your journey from idea to innovation in six simple steps
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Animated timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className={`flex items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="glass-card p-6 inline-block"
                  >
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 p-4 rounded-full bg-background border-2 border-primary glow-border"
                >
                  <step.icon className="w-6 h-6 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                </motion.div>

                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
