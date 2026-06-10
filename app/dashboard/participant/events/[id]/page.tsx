"use client"

import { motion, AnimatePresence } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, Trophy, CheckCircle2, Loader2, Users2, UserPlus, ArrowLeft, Sparkles, Star, Brain, Zap, Check, X, Plus, Calendar as CalendarIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter, useParams } from "next/navigation"
import { HolographicPanel } from "@/components/ecosystem/micro-interactions"

type RegistrationStep = "profile" | "participation" | "match" | "confirm" | "success"

const mockEvent = {
  id: "1",
  title: "AI Innovation Hackathon 2024",
  description: "Build the next generation of AI-powered applications using cutting-edge technologies.",
  status: "upcoming",
  startDate: new Date("2024-12-15"),
  endDate: new Date("2024-12-17"),
  location: "Virtual",
  currentParticipants: 234,
  maxParticipants: 500,
  prizePool: "$10,000",
  participationMode: "solo_or_team",
  minTeamSize: 2,
  maxTeamSize: 5,
  requiredSkills: ["React", "TypeScript", "AI/ML"],
  tags: ["AI", "Web3", "Innovation"],
}

const mockAIEventMatchScore = {
  score: 94,
  breakdown: {
    skills: 96,
    profile: 90,
    resume: 88,
    previousParticipation: 98,
  },
  reasoning: "Your React and TypeScript skills are a perfect match for this hackathon! Your experience with previous hackathons shows you have what it takes to succeed!",
}

const mockUserTeams = [
  { id: "1", name: "Nexus Innovators", members: 3, eventId: null },
  { id: "2", name: "Code Pioneers", members: 2, eventId: null },
]

const mockSuggestedTeammates = [
  { id: "1", name: "Sarah Chen", avatar: "SC", role: "Frontend Developer", skills: ["React", "TypeScript", "Tailwind"], compatibility: 94, status: "online" },
  { id: "2", name: "Mike Johnson", avatar: "MJ", role: "Backend Developer", skills: ["Node.js", "Python", "PostgreSQL"], compatibility: 89, status: "online" },
]

export default function EventDetailsPage() {
  const { id } = useParams()
  const { session } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("profile")
  const [isRegistered, setIsRegistered] = useState(false)
  const [participationMode, setParticipationMode] = useState<"solo" | "team">("solo")
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDesc, setNewTeamDesc] = useState("")
  const [event, setEvent] = useState<any>(mockEvent)
  const [isLoading, setIsLoading] = useState(false)
  const [userTeams, setUserTeams] = useState<any[]>(mockUserTeams)
  const [selectedTeamDetails, setSelectedTeamDetails] = useState<any>(null)
  const [showJoinByCode, setShowJoinByCode] = useState(false)
  const [joinCode, setJoinCode] = useState("")
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteMessage, setInviteMessage] = useState("")

  useEffect(() => {
    fetchEvent()
    fetchUserTeams()
  }, [id, session?.user?.id])

  const fetchEvent = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/events/${id}`)
      if (res.ok) {
        const data = await res.json()
        setEvent(data.event)
        if (data.event.isRegistered) {
          setIsRegistered(true)
        }
      }
    } catch (e) {
      console.error('Failed to fetch event:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserTeams = async () => {
    try {
      const res = await fetch('/api/teams?action=my-teams')
      if (res.ok) {
        const data = await res.json()
        setUserTeams(data.teams)
      }
    } catch (e) {
      console.error('Failed to fetch user teams:', e)
    }
  }

  const fetchTeamDetails = async (teamId: string) => {
    try {
      const res = await fetch(`/api/teams?action=team-details&teamId=${teamId}`)
      if (res.ok) {
        const data = await res.json()
        setSelectedTeamDetails(data)
      }
    } catch (e) {
      console.error('Failed to fetch team details:', e)
    }
  }

  const handleRegister = async () => {
    setCurrentStep("confirm")
  }

  const handleCreateTeam = async () => {
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          name: newTeamName,
          description: newTeamDesc,
          eventId: id,
        })
      })
      if (res.ok) {
        const data = await res.json()
        setShowCreateTeam(false)
        setNewTeamName('')
        setNewTeamDesc('')
        setSelectedTeam(data.team.id)
        setUserTeams([...userTeams, data.team])
        fetchTeamDetails(data.team.id)
      }
    } catch (e) {
      console.error('Failed to create team:', e)
    }
  }

  const handleJoinByCode = async () => {
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          inviteCode: joinCode,
        })
      })
      if (res.ok) {
        const data = await res.json()
        setShowJoinByCode(false)
        setJoinCode('')
        setSelectedTeam(data.team.id)
        fetchUserTeams()
        fetchTeamDetails(data.team.id)
      }
    } catch (e) {
      console.error('Failed to join team:', e)
    }
  }

  const handleInvite = async () => {
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'invite',
          teamId: selectedTeam,
          email: inviteEmail,
          message: inviteMessage,
        })
      })
      if (res.ok) {
        setShowInviteModal(false)
        setInviteEmail('')
        setInviteMessage('')
        if (selectedTeam) {
          fetchTeamDetails(selectedTeam)
        }
      }
    } catch (e) {
      console.error('Failed to invite:', e)
    }
  }

  const handleRegenerateCode = async () => {
    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'regenerate-code',
          teamId: selectedTeam,
        })
      })
      if (res.ok && selectedTeam) {
        const data = await res.json()
        fetchTeamDetails(selectedTeam)
      }
    } catch (e) {
      console.error('Failed to regenerate code:', e)
    }
  }

  const handleCompleteRegistration = async () => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: id,
          action: 'register'
        })
      })
      if (response.ok) {
        setCurrentStep("success")
        setIsRegistered(true)
      }
    } catch (e) {
      console.error("Failed to register:", e)
    }
  }

  const handleBack = () => {
    if (currentStep === "profile") {
      router.back()
    } else {
      const steps: RegistrationStep[] = ["profile", "participation", "match", "confirm", "success"]
      const currentIndex = steps.indexOf(currentStep)
      if (currentIndex > 0) {
        setCurrentStep(steps[currentIndex - 1])
      }
    }
  }

  const renderProfileStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Profile Readiness Check</h2>
        <p className="text-muted-foreground">Let's make sure your profile is optimized for this event</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Profile Completion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Score */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">92%</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "92%" }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Completed Items */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-primary">Completed</h3>
                {[
                  { label: "Profile Photo", done: true },
                  { label: "College Name", done: true },
                  { label: "Degree", done: true },
                  { label: "Skills", done: true },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

              {/* Missing Items */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-destructive">Missing</h3>
                {[
                  { label: "Resume", done: false },
                  { label: "Graduation Year", done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <X className="w-4 h-4 text-destructive" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Nexus AI Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Nexus AI recommends completing your profile before registration to improve team matching and event recommendations.
              </p>
              <Button className="w-full mt-4" onClick={() => router.push('/dashboard/participant/profile')}>
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button className="ml-auto" onClick={() => setCurrentStep("participation")}>
          Continue
        </Button>
      </div>
    </motion.div>
  )

  const renderParticipationStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Choose Participation Mode</h2>
        <p className="text-muted-foreground">Select how you'd like to participate in this event</p>
        <div className="mt-2 flex items-center justify-center gap-4 text-sm">
          <Badge variant="outline">{event.minTeamSize || 2}-{event.maxTeamSize || 5} members per team</Badge>
          <Badge variant="outline">Participation Mode: {event.participationMode || "solo_or_team"}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hide solo option if participation mode is team only */}
        {(event.participationMode === "solo_or_team" || event.participationMode === "solo") && (
          <HolographicPanel>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-6 cursor-pointer rounded-xl border-2 transition-all ${participationMode === "solo" ? "border-primary glow-border" : "border-border"}`}
              onClick={() => setParticipationMode("solo")}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Solo Participation</h3>
                  <p className="text-sm text-muted-foreground">Participate individually</p>
                </div>
              </div>
            </motion.div>
          </HolographicPanel>
        )}

        {/* Hide team option if participation mode is solo only */}
        {(event.participationMode === "solo_or_team" || event.participationMode === "team") && (
          <HolographicPanel>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`p-6 cursor-pointer rounded-xl border-2 transition-all ${participationMode === "team" ? "border-primary glow-border" : "border-border"}`}
              onClick={() => { setParticipationMode("team") }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Team Participation</h3>
                  <p className="text-sm text-muted-foreground">{event.minTeamSize || 2}-{event.maxTeamSize || 5} members</p>
                </div>
              </div>
            </motion.div>
          </HolographicPanel>
        )}
      </div>

      {participationMode === "team" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="glass-card p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 className="font-semibold">Team Management</h3>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setShowJoinByCode(!showJoinByCode)}>
                Join via Code
              </Button>
              <Button size="sm" onClick={() => setShowCreateTeam(!showCreateTeam)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </div>
          </div>

          {showCreateTeam && (
            <div className="mb-6 p-4 bg-secondary/30 rounded-lg border border-border">
              <h4 className="font-medium mb-2">Create New Team</h4>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Enter team name"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 mb-3"
              />
              <textarea
                value={newTeamDesc}
                onChange={(e) => setNewTeamDesc(e.target.value)}
                placeholder="Enter team description (optional)"
                rows={2}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 mb-3"
              />
              <div className="flex gap-2">
                <Button size="sm" className="glow-border" onClick={handleCreateTeam}>Create Team</Button>
                <Button size="sm" variant="outline" onClick={() => { setShowCreateTeam(false); setNewTeamName(""); setNewTeamDesc(""); }}>Cancel</Button>
              </div>
            </div>
          )}

          {showJoinByCode && (
            <div className="mb-6 p-4 bg-secondary/30 rounded-lg border border-border">
              <h4 className="font-medium mb-2">Join Team via Invite Code</h4>
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter 8-character invite code"
                maxLength={8}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 mb-3 uppercase"
              />
              <div className="flex gap-2">
                <Button size="sm" className="glow-border" onClick={handleJoinByCode}>Join Team</Button>
                <Button size="sm" variant="outline" onClick={() => { setShowJoinByCode(false); setJoinCode(""); }}>Cancel</Button>
              </div>
            </div>
          )}

          <h4 className="font-medium mb-3">Select Your Team</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userTeams.map((team) => (
              <div
                key={team.id}
                onClick={() => {
                  setSelectedTeam(team.id)
                  fetchTeamDetails(team.id)
                }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedTeam === team.id ? "border-primary bg-primary/5 glow-border" : "border-border"}`}
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">{team.name}</h5>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{team.currentMembers || 1}/{event.maxTeamSize || 5}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Team Details */}
          {selectedTeam && selectedTeamDetails && (
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Team: {selectedTeamDetails.team?.name}</h4>
                {selectedTeamDetails.team?.inviteCode && selectedTeamDetails.team?.leaderId === session?.user?.id && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(selectedTeamDetails.team.inviteCode)}>
                      Copy Invite Code
                    </Button>
                    <Button size="sm" onClick={handleRegenerateCode}>
                      Regenerate Code
                    </Button>
                  </div>
                )}
              </div>

              {/* Invite Code Display */}
              {selectedTeamDetails.team?.inviteCode && (
                <div className="mb-4 p-3 bg-secondary/30 rounded-lg border border-border text-center">
                  <p className="text-sm text-muted-foreground mb-1">Invite Code:</p>
                  <p className="text-2xl font-bold text-primary tracking-widest">{selectedTeamDetails.team.inviteCode}</p>
                </div>
              )}

              {/* Team Members */}
              <h5 className="font-medium mb-2">Team Members</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {selectedTeamDetails.members?.map((member: any) => (
                  <div key={member.id} className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg border border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">{(member.name || "U").slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Leader Actions */}
              {selectedTeamDetails.team?.leaderId === session?.user?.id && (
                <>
                  {/* Invite Teammates */}
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium">Pending Invitations</h5>
                    <Button size="sm" onClick={() => setShowInviteModal(true)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite Teammate
                    </Button>
                  </div>
                  <div className="space-y-2 mb-6">
                    {selectedTeamDetails.invitations?.length > 0 ? selectedTeamDetails.invitations?.map((invite: any) => (
                      <div key={invite.id} className="p-3 bg-secondary/20 rounded-lg border border-border">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{invite.inviteeName}</p>
                            <p className="text-xs text-muted-foreground">{invite.inviteeEmail}</p>
                          </div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-muted-foreground">No pending invitations</p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="font-semibold mb-4">AI Suggested Teammates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockSuggestedTeammates.map((teammate) => (
                <div key={teammate.id} className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">{teammate.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{teammate.name}</h5>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-primary" />
                          <span className="text-sm text-primary font-medium">{teammate.compatibility}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{teammate.role}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {teammate.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                    ))}
                  </div>
                  {selectedTeam && selectedTeamDetails?.team?.leaderId === session?.user?.id && (
                    <Button size="sm" variant="outline" className="w-full mt-3" onClick={() => {
                      setInviteEmail(''); setInviteMessage(`Join my team for ${event.title}!`); setShowInviteModal(true);
                    }}>
                      <UserPlus className="w-4 h-4 mr-1" />
                      Invite
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button className="ml-auto" onClick={() => setCurrentStep("match")} disabled={participationMode === "team" && !selectedTeam}>
          Continue
        </Button>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Invite Teammate</h3>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 mb-3"
            />
            <textarea
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              placeholder="Personal message (optional)"
              rows={3}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 mb-4"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowInviteModal(false)}>Cancel</Button>
              <Button className="glow-border" onClick={handleInvite}>Send Invitation</Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )

  const renderMatchStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">AI Event Match</h2>
        <p className="text-muted-foreground">Your compatibility score with this event</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Match Score Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full bg-primary/10 border-4 border-primary/30 flex items-center justify-center">
                    <span className="text-5xl font-bold text-primary">{mockAIEventMatchScore.score}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(mockAIEventMatchScore.breakdown).map(([key, value], i) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key}</span>
                    <span className="text-primary">{value}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI Reasoning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {mockAIEventMatchScore.reasoning}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button className="ml-auto" onClick={() => setCurrentStep("confirm")}>
          Continue
        </Button>
      </div>
    </motion.div>
  )

  const renderConfirmStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Confirm Registration</h2>
        <p className="text-muted-foreground">Review your registration details</p>
      </div>

      <Card className="glass-card">
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Event Name</p>
              <p className="font-medium">{mockEvent.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Participation Mode</p>
              <p className="font-medium capitalize">{participationMode}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AI Match Score</p>
              <p className="font-medium text-primary">{mockAIEventMatchScore.score}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profile Score</p>
              <p className="font-medium">92%</p>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-green-500">
              <CheckCircle2 className="w-4 h-4" />
              <span>Eligible to participate</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button className="ml-auto glow-border" onClick={handleCompleteRegistration}>
          Register for Event
        </Button>
      </div>
      </motion.div>
  )

  const renderSuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-primary/20 border-4 border-primary flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Registration Successful!</h2>
        <p className="text-muted-foreground">You're all set for the {event.title}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <HolographicPanel>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Nexus Roadmap</h3>
            </div>
            <p className="text-sm text-muted-foreground">Personalized hackathon roadmap</p>
          </div>
        </HolographicPanel>
        <HolographicPanel>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Recommended Tasks</h3>
            </div>
            <p className="text-sm text-muted-foreground">Get started on preparation</p>
          </div>
        </HolographicPanel>
        <HolographicPanel>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users2 className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Suggested Teammates</h3>
            </div>
            <p className="text-sm text-muted-foreground">Find your perfect team</p>
          </div>
        </HolographicPanel>
        <HolographicPanel>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">AI Mentor Plan</h3>
            </div>
            <p className="text-sm text-muted-foreground">Your personal AI mentor</p>
          </div>
        </HolographicPanel>
      </div>

      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => router.push("/dashboard/participant/events")}>
          Back to Events
        </Button>
        <Button className="glow-border" onClick={() => router.push("/dashboard/participant")}>
          Go to Dashboard
        </Button>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <DashboardHeader
        title={event.title}
        subtitle={event.description}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(event.startDate || event.start_date).toLocaleDateString()} - {new Date(event.endDate || event.end_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>{event.currentParticipants} / {event.maxParticipants} Participants</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="w-5 h-5" />
                  <span className="text-primary font-bold">{event.prizePool || event.prize}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {(event.tags || []).map((tag: string) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Registration Flow */}
          {!isRegistered ? (
            <div className="mt-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {["profile", "participation", "match", "confirm"].map((step, index) => {
                  const stepKey = step as RegistrationStep
                  const stepsOrder = ["profile", "participation", "match", "confirm"]
                  const isActive = stepsOrder.indexOf(currentStep) >= index
                  const isCompleted = stepsOrder.indexOf(currentStep) > index
                  return (
                    <div key={step} className="flex items-center">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 bg-background border-primary">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : (
                          <span className={isActive ? "text-primary" : "text-muted-foreground"}>{index + 1}</span>
                        )}
                      </div>
                      {index < 3 && <div className="w-12 h-1 bg-border" />}
                    </div>
                  )
                })}
              </div>
              <AnimatePresence mode="wait">
                {currentStep === "profile" && <div key="profile">{renderProfileStep()}</div>}
                {currentStep === "participation" && <div key="participation">{renderParticipationStep()}</div>}
                {currentStep === "match" && <div key="match">{renderMatchStep()}</div>}
                {currentStep === "confirm" && <div key="confirm">{renderConfirmStep()}</div>}
                {currentStep === "success" && <div key="success">{renderSuccessStep()}</div>}
              </AnimatePresence>
            </div>
          ) : (
            <div className="mt-6">
              {renderSuccessStep()}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              AI Event Match
            </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="text-4xl font-bold text-primary">{mockAIEventMatchScore.score}%</div>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Your compatibility score
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
