"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Users, Crown, GraduationCap, Scale, ArrowRight, Check } from "lucide-react"
import { AnimatedNetworkBackground } from "@/components/animated-network-background"
import { useState } from "react"
import { analyticsEvents } from "@/lib/analytics"
import { useRouter } from "next/navigation"

const roles = [
  {
    id: "participant",
    title: "Participant",
    description: "Join hackathons, build projects, and collaborate with teams",
    icon: Users,
    features: ["Join unlimited events", "AI team matching", "Earn NFT badges"],
    href: "/dashboard/participant",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: "host",
    title: "Host",
    description: "Create and manage hackathons, challenges, and innovation events",
    icon: Crown,
    features: ["Create events", "AI moderation", "Analytics dashboard"],
    href: "/dashboard/host",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "mentor",
    title: "Mentor",
    description: "Guide teams, share expertise, and help innovators succeed",
    icon: GraduationCap,
    features: ["Mentor teams", "Schedule sessions", "Build reputation"],
    href: "/dashboard/mentor",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "judge",
    title: "Judge",
    description: "Review submissions, evaluate projects, and select winners",
    icon: Scale,
    features: ["Review submissions", "AI-assisted scoring", "Compare projects"],
    href: "/dashboard/judge",
    color: "from-orange-500/20 to-amber-500/20",
  },
]

export default function RoleSelectPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const router = useRouter()

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedNetworkBackground />
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[96px]" />

      <div className="container relative z-10 px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center glow-border">
              <span className="text-primary font-bold text-xl">VN</span>
            </div>
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose Your Role</h1>
            <p className="text-muted-foreground text-lg">
              Select how you want to participate in the ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full text-left glass-card p-6 transition-all duration-300 ${
                    selectedRole === role.id
                      ? "border-primary glow-border"
                      : "hover:border-primary/50"
                  }`}
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${role.color} mb-4`}>
                    <role.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                  <ul className="space-y-2">
                    {role.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {selectedRole === role.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 pt-4 border-t border-border"
                    >
                      <button
                        onClick={() => {
                          analyticsEvents.roleSelected(role.id)
                          router.push(role.href)
                        }}
                        className="inline-flex items-center text-primary font-medium hover:underline"
                      >
                        Continue as {role.title}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </motion.div>
                  )}
                </button>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-8 text-sm text-muted-foreground"
          >
            You can change your role anytime from your profile settings
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
