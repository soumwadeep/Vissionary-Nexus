"use client"

import { motion, AnimatePresence } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Sparkles, Star, Code, Palette, Database, Brain, MessageSquare, Scan, Zap, Activity, Network, X, Send, Check, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { HolographicPanel } from "@/components/ecosystem/micro-interactions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { analyticsEvents } from "@/lib/analytics"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"

interface RecommendedTeammate {
  id: string | number
  name: string
  avatar: string
  role: string
  skills: string[]
  compatibility: number
  status: string
  aiAnalysis?: {
    compatibilityExplanation: string
    suggestedTeamStructure: string
    collaborationStrengths: string[]
    potentialRisks: string[]
    teamSuccessPrediction: string
  } | null
}

const skillFilters = [
  { icon: Code, label: "Development" },
  { icon: Palette, label: "Design" },
  { icon: Database, label: "Data" },
  { icon: Brain, label: "AI/ML" },
]

const matchingSteps = [
  { text: "Analyzing your profile...", duration: 800 },
  { text: "Scanning skill matrices...", duration: 600 },
  { text: "Computing compatibility scores...", duration: 1000 },
  { text: "Optimizing team composition...", duration: 800 },
  { text: "Finalizing recommendations...", duration: 600 },
]

export default function TeamMatchPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [isMatching, setIsMatching] = useState(false)
  const [matchingStep, setMatchingStep] = useState(0)
  const [showResults, setShowResults] = useState(true)
  const [scanningId, setScanningId] = useState<string | number | null>(null)
  const [networkPulse, setNetworkPulse] = useState(false)
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [selectedTeammate, setSelectedTeammate] = useState<RecommendedTeammate | null>(null)
  const [messageText, setMessageText] = useState("")
  const [invitedIds, setInvitedIds] = useState<(string | number)[]>([])
  const [sendingMessage, setSendingMessage] = useState(false)
  const [sendingInvite, setSendingInvite] = useState(false)
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [isCreatingTeam, setIsCreatingTeam] = useState(false)
  const [recommendedTeammates, setRecommendedTeammates] = useState<RecommendedTeammate[]>([])
  const [isLoadingTeammates, setIsLoadingTeammates] = useState(true)
  const [expandedAnalysisId, setExpandedAnalysisId] = useState<string | number | null>(null)
  const { toast } = useToast()
  const { session } = useAuth()

  // Fetch recommendations from API
  const fetchRecommendations = async () => {
    if (!session?.user?.id) return
    try {
      setIsLoadingTeammates(true)
      const response = await fetch("/api/team-match/recommendations")
      
      if (!response.ok) {
        console.warn("API request failed, using mock data")
        // Fallback to mock data
        const mockTeammates = [
          { id: '1', name: 'Sarah Chen', avatar: 'SC', role: 'Frontend Developer', skills: ['React', 'TypeScript', 'Tailwind'], compatibility: 94, status: 'online' },
          { id: '2', name: 'Mike Johnson', avatar: 'MJ', role: 'Backend Developer', skills: ['Node.js', 'Python', 'PostgreSQL'], compatibility: 89, status: 'online' },
          { id: '3', name: 'Elena Rodriguez', avatar: 'ER', role: 'UI/UX Designer', skills: ['Figma', 'User Research', 'Prototyping'], compatibility: 87, status: 'away' },
          { id: '4', name: 'David Kim', avatar: 'DK', role: 'AI/ML Engineer', skills: ['PyTorch', 'TensorFlow', 'Computer Vision'], compatibility: 85, status: 'online' },
        ]
        setRecommendedTeammates(mockTeammates)
        return
      }

      const data = await response.json()
      setRecommendedTeammates(data.recommendations || [])
      
      // Fire analytics event if we have valid data
      if (data.recommendations && data.recommendations.length > 0) {
        const scores = data.recommendations.map((t: RecommendedTeammate) => t.compatibility)
        const minScore = Math.min(...scores)
        const maxScore = Math.max(...scores)
        analyticsEvents.teamMatchGenerated(data.recommendations.length, minScore, maxScore)
        analyticsEvents.aiMatchGenerated(data.recommendations.length, minScore, maxScore)
      }
    } catch (err) {
      console.error("Failed to fetch recommendations:", err)
      // Fallback to default data
      const mockTeammates = [
        { id: '1', name: 'Sarah Chen', avatar: 'SC', role: 'Frontend Developer', skills: ['React', 'TypeScript', 'Tailwind'], compatibility: 94, status: 'online' },
        { id: '2', name: 'Mike Johnson', avatar: 'MJ', role: 'Backend Developer', skills: ['Node.js', 'Python', 'PostgreSQL'], compatibility: 89, status: 'online' },
        { id: '3', name: 'Elena Rodriguez', avatar: 'ER', role: 'UI/UX Designer', skills: ['Figma', 'User Research', 'Prototyping'], compatibility: 87, status: 'away' },
      ]
      setRecommendedTeammates(mockTeammates)
    } finally {
      setIsLoadingTeammates(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchRecommendations()
  }, [session?.user?.id])

  const handleMessage = (teammate: RecommendedTeammate) => {
    setSelectedTeammate(teammate)
    setMessageText("")
    setMessageDialogOpen(true)
  }

  const handleInvite = (teammate: RecommendedTeammate) => {
    setSelectedTeammate(teammate)
    setInviteDialogOpen(true)
  }

  const sendMessage = async () => {
    if (!selectedTeammate || !messageText.trim()) return
    setSendingMessage(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSendingMessage(false)
    setMessageDialogOpen(false)
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${selectedTeammate.name}.`,
    })
  }

  const confirmInvite = async () => {
    if (!selectedTeammate) return
    setSendingInvite(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Fire analytics event
    analyticsEvents.teamInviteSent(String(selectedTeammate.id), selectedTeammate.name)
    
    setSendingInvite(false)
    setInvitedIds(prev => [...prev, selectedTeammate.id])
    setInviteDialogOpen(false)
    toast({
      title: "Invitation Sent",
      description: `Team invitation sent to ${selectedTeammate.name}. You'll be notified when they respond.`,
    })
  }

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      toast({
        title: "Missing Team Name",
        description: "Please enter a name for your team.",
        variant: "destructive",
      })
      return
    }
    setIsCreatingTeam(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    analyticsEvents.teamCreated(newTeamName, "participant")
    setIsCreatingTeam(false)
    setCreateTeamDialogOpen(false)
    setNewTeamName("")
    toast({
      title: "Team Created!",
      description: `Team "${newTeamName}" has been created successfully.`,
    })
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const startMatching = async () => {
    setIsMatching(true)
    setShowResults(false)
    setMatchingStep(0)

    for (let i = 0; i < matchingSteps.length; i++) {
      setMatchingStep(i)
      await new Promise((resolve) => setTimeout(resolve, matchingSteps[i].duration))
    }

    // Refresh recommendations
    await fetchRecommendations()

    setIsMatching(false)
    setShowResults(true)
    setNetworkPulse(true)
    setTimeout(() => setNetworkPulse(false), 2000)
  }

  // Simulate periodic scanning
  useEffect(() => {
    if (recommendedTeammates.length === 0) return
    
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * recommendedTeammates.length)
      setScanningId(recommendedTeammates[randomIndex].id)
      setTimeout(() => setScanningId(null), 1000)
    }, 5000)
    return () => clearInterval(interval)
  }, [recommendedTeammates])

  if (isLoadingTeammates) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading recommendations...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <DashboardHeader
        title="AI Team Match"
        subtitle="Find your perfect hackathon teammates with AI-powered matching"
      />

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4 mb-6"
      >
        <Button className="gap-2" onClick={() => setCreateTeamDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Create Team
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matching Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 relative overflow-hidden"
        >
          {/* AI activity indicator */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"
          />

          <div className="flex items-center gap-2 mb-6 relative">
            <motion.div
              animate={{ rotate: isMatching ? 360 : 0 }}
              transition={{ duration: 2, repeat: isMatching ? Infinity : 0, ease: "linear" }}
              className="p-2 rounded-lg bg-primary/10 border border-primary/20 glow-border"
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
            <div>
              <h3 className="font-semibold">Match Preferences</h3>
              <span className="text-xs text-muted-foreground">AI-powered analysis</span>
            </div>
          </div>

          <div className="space-y-4 relative">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Filter by Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {skillFilters.map((filter) => (
                  <motion.div key={filter.label} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant={selectedSkills.includes(filter.label) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSkill(filter.label)}
                      className={selectedSkills.includes(filter.label) ? "glow-border" : ""}
                    >
                      <filter.icon className="w-4 h-4 mr-1" />
                      {filter.label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full glow-border h-12"
                onClick={startMatching}
                disabled={isMatching}
              >
                <AnimatePresence mode="wait">
                  {isMatching ? (
                    <motion.div
                      key="matching"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Scan className="w-4 h-4 mr-2" />
                      </motion.div>
                      {matchingSteps[matchingStep]?.text}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="start"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Start AI Matching
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Matching progress */}
            <AnimatePresence>
              {isMatching && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  {matchingSteps.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: i <= matchingStep ? 1 : 0.3,
                        x: 0,
                      }}
                      className="flex items-center gap-2 text-xs"
                    >
                      <motion.div
                        animate={i === matchingStep ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.5, repeat: i === matchingStep ? Infinity : 0 }}
                        className={`w-2 h-2 rounded-full ${i < matchingStep ? "bg-primary" : i === matchingStep ? "bg-primary animate-pulse" : "bg-muted"}`}
                      />
                      <span className={i <= matchingStep ? "text-foreground" : "text-muted-foreground"}>
                        {step.text.replace("...", "")}
                      </span>
                      {i < matchingStep && <Zap className="w-3 h-3 text-primary" />}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Compatibility Legend */}
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-medium mb-3">Compatibility Score</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-3 h-3 rounded-full bg-primary"
                />
                <span className="text-muted-foreground">90-100% Perfect Match</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-2" />
                <span className="text-muted-foreground">70-89% Great Match</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-chart-4" />
                <span className="text-muted-foreground">50-69% Good Match</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recommended Teammates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Recommended Teammates
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs text-primary ml-2"
              >
                <Activity className="w-3 h-3 inline mr-1" />
                Live
              </motion.span>
            </h3>
            <span className="text-sm text-muted-foreground">
              {recommendedTeammates.length} matches found
            </span>
          </div>

          <AnimatePresence mode="wait">
            {showResults ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {recommendedTeammates.map((teammate, index) => {
                  const isScanning = scanningId === teammate.id

                  return (
                    <motion.div
                      key={teammate.id}
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="glass-card p-4 cursor-pointer group relative overflow-hidden"
                    >
                      {/* Scanning effect */}
                      <AnimatePresence>
                        {isScanning && (
                          <motion.div
                            initial={{ top: "-100%" }}
                            animate={{ top: "100%" }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-primary to-transparent pointer-events-none"
                          />
                        )}
                      </AnimatePresence>

                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <motion.div
                            animate={networkPulse ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.5 }}
                            className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center"
                          >
                            <span className="text-primary font-semibold">{teammate.avatar}</span>
                          </motion.div>
                          <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                              teammate.status === "online"
                                ? "bg-green-500"
                                : teammate.status === "away"
                                ? "bg-yellow-500"
                                : "bg-gray-500"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                              {teammate.name}
                            </h4>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 + index * 0.05 }}
                              className="flex items-center gap-1"
                            >
                              <Star className="w-4 h-4 text-primary" />
                              <span className="text-sm text-primary font-medium">
                                {teammate.compatibility}%
                              </span>
                            </motion.div>
                          </div>
                          <p className="text-sm text-muted-foreground">{teammate.role}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {teammate.skills.map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Compatibility bar */}
                      <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${teammate.compatibility}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className="h-full bg-primary"
                        />
                      </div>

                      {/* AI Analysis Panel */}
                      {teammate.aiAnalysis && (
                        <div className="mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs gap-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              const newExpandedId = expandedAnalysisId === teammate.id ? null : teammate.id
                              setExpandedAnalysisId(newExpandedId)
                              if (newExpandedId) {
                                analyticsEvents.aiAnalysisViewed(String(teammate.id), teammate.compatibility)
                              }
                            }}
                          >
                            <Brain className="w-3 h-3" />
                            {expandedAnalysisId === teammate.id ? "Hide AI Analysis" : "Show AI Analysis"}
                          </Button>

                          <AnimatePresence>
                            {expandedAnalysisId === teammate.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 space-y-3 overflow-hidden"
                              >
                                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                                  <h5 className="text-sm font-semibold text-primary mb-2 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    Compatibility Explanation
                                  </h5>
                                  <p className="text-xs text-muted-foreground">
                                    {teammate.aiAnalysis.compatibilityExplanation}
                                  </p>
                                </div>

                                <div className="bg-secondary/30 rounded-lg p-3">
                                  <h5 className="text-sm font-semibold mb-2">Suggested Team Structure</h5>
                                  <p className="text-xs text-muted-foreground">
                                    {teammate.aiAnalysis.suggestedTeamStructure}
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="bg-secondary/30 rounded-lg p-3">
                                    <h5 className="text-sm font-semibold mb-2 flex items-center gap-1">
                                      <Star className="w-3 h-3 text-primary" />
                                      Collaboration Strengths
                                    </h5>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                      {teammate.aiAnalysis.collaborationStrengths.map((strength, i) => (
                                        <li key={i} className="flex items-start gap-1">
                                          <span className="text-primary mt-1">•</span>
                                          {strength}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div className="bg-secondary/30 rounded-lg p-3">
                                    <h5 className="text-sm font-semibold mb-2">Potential Risks</h5>
                                    <ul className="text-xs text-muted-foreground space-y-1">
                                      {teammate.aiAnalysis.potentialRisks.map((risk, i) => (
                                        <li key={i} className="flex items-start gap-1">
                                          <span className="text-yellow-500 mt-1">•</span>
                                          {risk}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                                  <p className="text-xs text-muted-foreground">
                                    <span className="font-medium text-primary">Prediction:</span> {teammate.aiAnalysis.teamSuccessPrediction}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMessage(teammate)
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                        <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            size="sm" 
                            className="w-full glow-border"
                            disabled={invitedIds.includes(teammate.id)}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleInvite(teammate)
                            }}
                          >
                            {invitedIds.includes(teammate.id) ? (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Invited
                              </>
                            ) : (
                              "Invite"
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-96 flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full"
                  />
                  <p className="text-muted-foreground">AI is analyzing the network...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Network Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Network className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Collaboration Network</h3>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </motion.div>
          </div>

          <div className="h-64 relative flex items-center justify-center">
            {/* Central node (you) */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 20px rgba(74, 222, 128, 0.3)",
                  "0 0 40px rgba(74, 222, 128, 0.5)",
                  "0 0 20px rgba(74, 222, 128, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center z-10"
            >
              <span className="text-primary font-bold">You</span>
            </motion.div>

            {/* Connected nodes */}
            {recommendedTeammates.slice(0, 6).map((teammate, index) => {
              const angle = (index * 60 - 90) * (Math.PI / 180)
              const radius = 100
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius

              return (
                <motion.div
                  key={teammate.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                  className="absolute w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-medium cursor-pointer hover:border-primary hover:bg-primary/10 transition-colors"
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                >
                  {teammate.avatar}
                </motion.div>
              )
            })}

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {recommendedTeammates.slice(0, 6).map((teammate, index) => {
                const angle = (index * 60 - 90) * (Math.PI / 180)
                const radius = 100
                const x = Math.cos(angle) * radius + 128
                const y = Math.sin(angle) * radius + 128

                return (
                  <g key={teammate.id}>
                    <motion.line
                      x1="128"
                      y1="128"
                      x2={x}
                      y2={y}
                      stroke="rgb(74, 222, 128)"
                      strokeWidth="1"
                      strokeOpacity={teammate.compatibility / 100 * 0.5}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    />
                    {/* Animated pulse along line */}
                    <motion.circle
                      r="3"
                      fill="rgb(74, 222, 128)"
                      initial={{ opacity: 0 }}
                      animate={{
                        cx: [128, x],
                        cy: [128, y],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                  </g>
                )
              })}
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Message {selectedTeammate?.name}
            </DialogTitle>
            <DialogDescription>
              Send a message to start a conversation about collaborating together.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">{selectedTeammate?.avatar}</span>
              </div>
              <div>
                <p className="font-medium">{selectedTeammate?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedTeammate?.role}</p>
              </div>
            </div>
            <Textarea
              placeholder="Hi! I saw your profile and would love to collaborate on..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={sendMessage} 
              disabled={!messageText.trim() || sendingMessage}
              className="glow-border"
            >
              {sendingMessage ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Invite to Team
            </DialogTitle>
            <DialogDescription>
              Send a team invitation to {selectedTeammate?.name}. They will receive a notification and can accept or decline.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <span className="text-primary font-semibold">{selectedTeammate?.avatar}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{selectedTeammate?.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedTeammate?.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm text-primary font-medium">{selectedTeammate?.compatibility}%</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedTeammate?.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmInvite} 
              disabled={sendingInvite}
              className="glow-border"
            >
              {sendingInvite ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Team Dialog */}
      <Dialog open={createTeamDialogOpen} onOpenChange={setCreateTeamDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Create New Team
            </DialogTitle>
            <DialogDescription>
              Create a new team to participate in hackathons and collaborate with other developers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name *</Label>
              <Input
                id="teamName"
                placeholder="Enter your team name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateTeamDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTeam} 
              disabled={isCreatingTeam || !newTeamName.trim()}
              className="glow-border"
            >
              {isCreatingTeam ? "Creating Team..." : "Create Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
