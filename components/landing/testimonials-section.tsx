"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Startup Founder",
    avatar: "SC",
    content: "Vissionary Nexus completely transformed how we build teams. The AI matching found us the perfect co-founders within days.",
  },
  {
    name: "Marcus Johnson",
    role: "Full-Stack Developer",
    avatar: "MJ",
    content: "The AI mentor guided me through my first hackathon. I went from beginner to winning third place in just 48 hours.",
  },
  {
    name: "Elena Rodriguez",
    role: "Product Designer",
    avatar: "ER",
    content: "Finally, a platform that truly understands the innovation ecosystem. The blockchain badges are a game-changer for my portfolio.",
  },
  {
    name: "David Kim",
    role: "AI Researcher",
    avatar: "DK",
    content: "The autonomous agents are incredibly sophisticated. It feels like having a whole team of assistants working 24/7.",
  },
]

export function TestimonialsSection() {
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
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Trusted by <span className="text-primary glow-text">Innovators</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of builders transforming their ideas into reality
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6 relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{testimonial.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
