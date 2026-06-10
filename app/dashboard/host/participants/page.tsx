"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Search,
  Filter,
  Eye,
  Mail,
  Trophy,
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface Participant {
  id: string
  name: string
  email: string
  walletAddress: string | null
  reputation: number
  createdAt: string
  eventsJoined: number
  submissions: number
}

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchParticipants()
  }, [search])

  const fetchParticipants = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)

      const response = await fetch(`/api/host/participants?${params.toString()}`)
      const data = await response.json()
      setParticipants(data.participants || [])
    } catch (error) {
      console.error("Error fetching participants:", error)
      setParticipants([])
    } finally {
      setLoading(false)
    }
  }

  const getStats = () => {
    const total = participants.length
    const verifiedWallets = participants.filter(p => p.walletAddress).length

    return [
      { label: "Total Participants", value: total.toString(), icon: Users },
      { label: "Active Today", value: "0", icon: Users },
      { label: "New This Week", value: "0", icon: Trophy },
      { label: "Verified Wallets", value: verifiedWallets.toString(), icon: Trophy },
    ]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Participants"
        subtitle="Manage and view all participants in your events"
      />

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        {getStats().map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <stat.icon className="w-5 h-5 text-chart-2 mb-2" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-6 flex flex-wrap gap-4 items-center"
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search participants..."
            className="h-12 bg-secondary border-border pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </motion.div>

      {/* Participants List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {participants.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No participants found</p>
          </div>
        ) : (
          participants.map((participant, index) => (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <span className="text-primary font-bold">
                      {participant.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{participant.name || "Unknown User"}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{participant.email}</span>
                      <span>•</span>
                      <span>Joined {new Date(participant.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">Events: {participant.eventsJoined}</div>
                    <div className="text-xs text-muted-foreground">Submissions: {participant.submissions}</div>
                  </div>
                  <Badge variant="default">
                    active
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </>
  )
}
