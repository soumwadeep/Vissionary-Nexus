"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Users,
  FileText,
  Plus,
  Award,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { HolographicPanel } from "@/components/ecosystem/micro-interactions"

interface Event {
  id: string;
  title: string;
  description?: string | null;
  type?: string | null;
  status?: string | null;
  startDate: string;
  endDate: string;
  registrationDeadline?: string | null;
  maxParticipants?: number | null;
  currentParticipants?: number | null;
  prizePool?: string | null;
  currency?: string | null;
  image?: string | null;
  location?: string | null;
  isVirtual?: boolean | null;
  tags?: string[] | null;
  requirements?: string[] | null;
  prizes?: any[] | null;
  judges?: any[] | null;
  sponsors?: any[] | null;
  createdBy?: string | null;
  participationMode?: string | null;
  minTeamSize?: number | null;
  maxTeamSize?: number | null;
  requiredSkills?: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export default function HostDashboard() {
  const { data: session, status: sessionStatus } = useSession()
  
  const [events, setEvents] = useState<Event[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null)
  
  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      if (!session?.user?.id) return
      
      try {
        const res = await fetch(`/api/events?createdBy=${session.user.id}`)
        const data = await res.json()
        // Deduplicate events by ID
        const uniqueEvents = Array.from(
          new Map((data.events || []).map((e: Event) => [e.id, e])).values()
        ) as Event[]
        setEvents(uniqueEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setIsLoadingEvents(false)
      }
    }
    
    if (sessionStatus === 'authenticated') {
      fetchEvents()
    }
  }, [session, sessionStatus])
  
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    
    setDeletingEventId(eventId)
    try {
      const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' })
      if (res.ok) {
        setEvents(prev => prev.filter(e => e.id !== eventId))
      }
    } catch (error) {
      console.error('Error deleting event:', error)
    } finally {
      setDeletingEventId(null)
    }
  }

  // Calculate real stats
  const totalParticipants = events.reduce((sum, e) => sum + (e.currentParticipants || 0), 0)
  const [activityPulse, setActivityPulse] = useState(false)

  // Activity pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityPulse(true)
      setTimeout(() => setActivityPulse(false), 500)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const stats = [
    { icon: Calendar, label: "Your Events", value: events.length.toString(), change: "+0" },
    { icon: Users, label: "Total Participants", value: totalParticipants.toString(), change: "+0" },
    { icon: FileText, label: "Submissions", value: "0", change: "+0" },
    { icon: Plus, label: "Create Event", value: "", change: "", isButton: true, href: "/dashboard/host/events/create" },
  ]

  return (
    <>
      <DashboardHeader
        title="Host Dashboard"
        subtitle="Manage your hackathons and track participant activity"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => {
            if (stat.isButton) {
              return (
                <HolographicPanel key={stat.label}>
                  <Button asChild className="w-full h-full justify-start p-0">
                    <Link href={stat.href!} className="w-full p-4">
                      <div className="relative overflow-hidden w-full">
                        {/* Activity indicator */}
                        {activityPulse && index === 0 && (
                          <motion.div
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 3, opacity: 0 }}
                            className="absolute inset-0 bg-primary rounded-xl"
                          />
                        )}
                        <div className="flex items-center gap-3 w-full">
                          <motion.div
                            animate={{ rotate: activityPulse ? 360 : 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <stat.icon className="w-5 h-5 text-primary" />
                          </motion.div>
                          <span className="text-sm">{stat.label}</span>
                        </div>
                      </div>
                    </Link>
                  </Button>
                </HolographicPanel>
              )
            }
            return (
              <HolographicPanel key={stat.label}>
                <div className="p-4 relative overflow-hidden">
                  {/* Activity indicator */}
                  {activityPulse && index === 0 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 3, opacity: 0 }}
                      className="absolute inset-0 bg-primary rounded-xl"
                    />
                  )}
                  <div className="flex items-center justify-between mb-2 relative">
                    <motion.div
                      animate={{ rotate: activityPulse ? 360 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <stat.icon className="w-5 h-5 text-primary" />
                    </motion.div>
                    <motion.span
                      key={stat.change}
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-xs text-primary font-medium"
                    >
                      {stat.change}
                    </motion.span>
                  </div>
                  <motion.div
                    key={stat.value}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              </HolographicPanel>
            )
          })}
        </motion.div>

        {/* Active Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 glass-card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Your Events
            </h3>
            <Button asChild size="sm" className="glow-border">
              <Link href="/dashboard/host/events/create">
                <Plus className="w-4 h-4 mr-1" />
                Create Event
              </Link>
            </Button>
          </div>

          <div className="space-y-4">
            {isLoadingEvents ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No events created yet</p>
                <Button asChild size="sm" className="mt-4 glow-border">
                  <Link href="/dashboard/host/events/create">
                    <Plus className="w-4 h-4 mr-1" />
                    Create your first event
                  </Link>
                </Button>
              </div>
            ) : (
              events.map((event, index) => {
                const formatDate = (dateString: string) => {
                  try {
                    return new Date(dateString).toLocaleDateString()
                  } catch {
                    return "Invalid Date"
                  }
                }
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5, backgroundColor: "rgba(74, 222, 128, 0.05)" }}
                    className="p-4 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium flex-1">{event.title}</h4>
                          <Badge
                            variant={event.status === "active" ? "default" : "secondary"}
                          >
                            {event.status === "active" && (
                              <motion.span
                                className="w-1.5 h-1.5 rounded-full bg-white mr-1.5"
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              />
                            )}
                            {event.status || 'upcoming'}
                          </Badge>
                        </div>
                        {event.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {formatDate(event.startDate)} - {formatDate(event.endDate)}
                        </span>
                      </div>
                      {event.maxParticipants && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{event.currentParticipants || 0}/{event.maxParticipants} participants</span>
                        </div>
                      )}
                      {event.prizePool && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-muted-foreground" />
                          <span className="text-primary font-semibold">${event.prizePool} prize pool</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Edit/Delete buttons */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/dashboard/host/events/edit/${event.id}`}>
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => handleDeleteEvent(event.id)}
                        disabled={deletingEventId === event.id}
                      >
                        {deletingEventId === event.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-1" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </motion.div>
      </div>
    </>
  )
}
