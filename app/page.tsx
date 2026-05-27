"use client"

import { useState, useEffect } from "react"
import { ParticleField } from "@/components/ecosystem/particle-field"
import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { AIAgentsSection } from "@/components/landing/ai-agents-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { LiveAnalyticsSection } from "@/components/landing/live-analytics-section"
import { BlockchainSection } from "@/components/landing/blockchain-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { Footer } from "@/components/landing/footer"
import { EcosystemMap } from "@/components/ecosystem/ecosystem-map"
import { AIBootSequence } from "@/components/ecosystem/ai-boot-sequence"
import { motion, AnimatePresence } from "framer-motion"
import { Network } from "lucide-react"

export default function LandingPage() {
  const [showBootSequence, setShowBootSequence] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if boot sequence has been shown in this session
    const hasBooted = sessionStorage.getItem("nexus-booted")
    if (hasBooted) {
      setShowBootSequence(false)
      setIsLoaded(true)
    }
  }, [])

  const handleBootComplete = () => {
    sessionStorage.setItem("nexus-booted", "true")
    setShowBootSequence(false)
    setTimeout(() => setIsLoaded(true), 100)
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showBootSequence && (
          <AIBootSequence onComplete={handleBootComplete} />
        )}
      </AnimatePresence>

      <motion.div 
        className="relative min-h-screen overflow-hidden noise-texture"
        initial={{ opacity: 0 }}
        animate={{ opacity: showBootSequence ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      >
        <ParticleField />
        <Navbar />
        <main>
          <HeroSection />
          <div id="ecosystem">
            <AIAgentsSection />
          </div>

          {/* Live Ecosystem Visualization */}
          <section className="relative py-20 overflow-hidden">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
                  <Network className="w-4 h-4 text-primary" />
                  <span className="text-primary text-sm font-medium">Real-Time Activity</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Live <span className="text-primary glow-text">Ecosystem</span> Map
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Watch the innovation network in real-time - see collaborations form, AI agents process tasks, and projects come to life
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <EcosystemMap />
              </motion.div>
            </div>
          </section>

          <div id="how-it-works">
            <HowItWorksSection />
          </div>
          <div id="analytics">
            <LiveAnalyticsSection />
          </div>
          <div id="blockchain">
            <BlockchainSection />
          </div>
          <TestimonialsSection />
        </main>
        <Footer />
      </motion.div>
    </>
  )
}
