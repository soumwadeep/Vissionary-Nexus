"use client"

import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, ExternalLink, Search, Filter, CheckCircle2, Loader2, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { analyticsEvents } from "@/lib/analytics"
import { useRouter } from "next/navigation"

// Original mock data
const mockEvents = [
  {
    id: "mock-1",
    title: "AI Innovation Hackathon 2024",
    status: "registered",
    start_date: new Date("2024-12-15").toISOString(),
    location: "Virtual",
    participants: 234,
    prize: "$10,000",
    image: "/placeholder.svg",
  },
  {
    id: "mock-2",
    title: "Web3 DeFi Challenge",
    status: "upcoming",
    start_date: new Date("2024-12-20").toISOString(),
    location: "San Francisco, CA",
    participants: 156,
    prize: "$25,000",
    image: "/placeholder.svg",
  },
  {
    id: "mock-3",
    title: "Climate Tech Buildathon",
    status: "upcoming",
    start_date: new Date("2025-01-05").toISOString(),
    location: "Virtual",
    participants: 312,
    prize: "$15,000",
    image: "/placeholder.svg",
  },
  {
    id: "mock-4",
    title: "Healthcare AI Summit",
    status: "completed",
    start_date: new Date("2024-11-10").toISOString(),
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
  active: { label: "Active", variant: "default" as const },
}

export default function EventsPage() {
  const { session } = useAuth()
  const router = useRouter()
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [session?.user?.id])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        if (data.events && data.events.length > 0) {
          setEvents(data.events)
        } else {
          setEvents(mockEvents)
        }
      } else {
        setEvents(mockEvents)
      }
    } catch (e) {
      console.error('Failed to fetch events:', e)
      setEvents(mockEvents)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (eventId: string) => {
    router.push(`/dashboard/participant/events/${eventId}`)
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
        {isLoading ? (
          <div className="col-span-2 flex items-center justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          events.map((event, index) => {
            const isRegistered = event.isRegistered
            const eventStatus = event.status || "upcoming"
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card overflow-hidden group cursor-pointer"
                onClick={() => handleViewDetails(event.id)}
              >
                <div className="h-40 bg-gradient-to-br from-primary/20 to-chart-2/20 relative">
                  <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                  <Badge
                    variant={isRegistered ? statusConfig.registered.variant : statusConfig[eventStatus as keyof typeof statusConfig]?.variant || "secondary"}
                    className="absolute top-4 right-4"
                  >
                    {isRegistered ? statusConfig.registered.label : statusConfig[eventStatus as keyof typeof statusConfig]?.label || "Upcoming"}
                  </Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {(() => {
                        const date = event.startDate || event.start_date;
                        if (date) {
                          const d = new Date(date);
                          if (!isNaN(d.getTime())) {
                            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                          }
                        }
                        return "TBA";
                      })()}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                    )}
                    {(event.currentParticipants || event.participants) && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {event.currentParticipants || event.participants} participants
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-xs text-muted-foreground">Prize Pool</span>
                      <p className="text-lg font-bold text-primary">{event.prize_pool || event.prize || "TBD"}</p>
                    </div>
                    <Button className="gap-2" variant={isRegistered ? "default" : "default"}>
                      {isRegistered ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Registered
                        </>
                      ) : (
                        <>
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </>
  )
}
