"use client"

import { motion } from "framer-motion"
import { Award, Shield, Fingerprint, BarChart3, Link } from "lucide-react"

const features = [
  {
    icon: Award,
    title: "NFT Achievement Badges",
    description: "Earn unique NFT badges for every milestone, competition win, and contribution",
  },
  {
    icon: BarChart3,
    title: "On-chain Reputation",
    description: "Build a verifiable, permanent record of your skills and achievements",
  },
  {
    icon: Shield,
    title: "Proof of Participation",
    description: "Cryptographic proof for every hackathon, event, and collaboration",
  },
  {
    icon: Fingerprint,
    title: "Decentralized Identity",
    description: "Own your innovation identity across the entire Web3 ecosystem",
  },
  {
    icon: Link,
    title: "Transparent Scoring",
    description: "Fair, immutable scoring system powered by smart contracts",
  },
]

export function BlockchainSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      {/* Animated blockchain visualization */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-16 h-16 border border-primary/30 rounded-lg"
            style={{
              left: `${10 + i * 16}%`,
              top: `${20 + (i % 2) * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full">
          <motion.line
            x1="18%"
            y1="35%"
            x2="34%"
            y2="50%"
            stroke="rgb(74, 222, 128)"
            strokeWidth="1"
            strokeOpacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.line
            x1="34%"
            y1="35%"
            x2="50%"
            y2="50%"
            stroke="rgb(74, 222, 128)"
            strokeWidth="1"
            strokeOpacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <span className="text-primary text-sm font-medium">Powered by Somnia</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-primary glow-text">Blockchain</span> Integration
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your achievements, reputation, and identity secured on the blockchain
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              className={`glass-card p-6 ${index === 4 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 inline-block mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* NFT Badge Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <div className="flex -space-x-4">
            {["Hackathon Winner", "Top Contributor", "Innovation Leader", "Mentor"].map((badge, i) => (
              <motion.div
                key={badge}
                whileHover={{ scale: 1.1, zIndex: 10 }}
                className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/50 flex items-center justify-center glow-border"
                style={{ zIndex: 4 - i }}
              >
                <Award className="w-8 h-8 text-primary" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
