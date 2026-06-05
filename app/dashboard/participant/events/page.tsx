"use client"

import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, ExternalLink, Search, Filter, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { analyticsEvents } from "@/lib/analytics"

const events = [
  {
    id: 1,
    title: "AI Innovation Hackathon 2024",
    status: "registered",
    date: "Dec 15-17, 2024",
    time: "9:00 AM - 6:00 PM",
    location: "Virtual",
    participants: 234,
    prize: "$10,000",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Web3 DeFi Challenge",
    status: "upcoming",
    date: "Dec 20-22, 2024",
    time: "10:00 AM - 5:00 PM",
    location: "San Francisco, CA",
    participants: 156,
    prize: "$25,000",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Climate Tech Buildathon",
    status: "upcoming",
    date: "Jan 5-7, 2025",
    time: "9:00 AM - 8:00 PM",
    location: "Virtual",
    participants: 312,
    prize: "$15,000",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Healthcare AI Summit",
    status: "completed",
    date: "Nov 10-12, 2024",
    time: "8:00 AM - 5:00 PM",
    location: "Boston, MA",
    participants: 189,
    prize: "$20,000",
    image: "/placeholder.svg",
  },
]

const statusConfig = {
  registered: { label: "Registered", variant: "default" as const },
  upcoming: { label: "Upcoming", variant: "secondary" as const },
  completed: { label: "Completed", variant: "outline" as const },
}

export default function EventsPage() {
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>(
    events.filter(e => e.status === "registered").map(e => e.id)
  )

  const handleRegister = (event: typeof events[0]) => {
    // Track analytics event
    analyticsEvents.eventRegistered(String(event.id), event.title)
    // Update state to mark as registered
    setRegisteredEventIds(prev => [...prev, event.id])
  }

  return (
    <>
      <DashboardHeader
        title="Events"
        subtitle="Discover and participate in hackathons and innovation challenges"
      />

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10 bg-secondary border-border"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </motion.div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event, index) => {
          const isRegistered = registeredEventIds.includes(event.id)
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card overflow-hidden group"
            >
              <div className="h-40 bg-gradient-to-br from-primary/20 to-chart-2/20 relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                <Badge
                  variant={isRegistered ? statusConfig.registered.variant : statusConfig[event.status as keyof typeof statusConfig].variant}
                  className="absolute top-4 right-4"
                >
                  {isRegistered ? statusConfig.registered.label : statusConfig[event.status as keyof typeof statusConfig].label}
                </Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {event.participants} participants
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <span className="text-xs text-muted-foreground">Prize Pool</span>
                    <p className="text-lg font-bold text-primary">{event.prize}</p>
                  </div>
                  {isRegistered ? (
                    <Button className="gap-2" disabled>
                      <CheckCircle2 className="w-4 h-4" />
                      Registered
                    </Button>
                  ) : (
                    <Button 
                      className="gap-2"
                      onClick={() => handleRegister(event)}
                    >
                      Register Now
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </>
  )
}
