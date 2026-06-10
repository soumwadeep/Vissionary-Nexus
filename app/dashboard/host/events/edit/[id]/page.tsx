"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Trophy,
  Users,
  FileText,
  Sparkles,
  Upload,
  Link as LinkIcon,
  Plus,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react"

const EVENT_TYPES = [
  { value: "hackathon", label: "Hackathon" },
  { value: "challenge", label: "Challenge" },
  { value: "workshop", label: "Workshop" },
  { value: "competition", label: "Competition" },
  { value: "other", label: "Other" },
]

const PARTICIPATION_MODES = [
  { value: "solo", label: "Solo Only" },
  { value: "team", label: "Team Only" },
  { value: "solo_or_team", label: "Solo or Team" },
]

const DEFAULT_REQUIRED_SKILLS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "Machine Learning",
  "AI", "Web3", "Blockchain", "UI/UX", "Design", "Mobile Development", "Backend"
]

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

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "hackathon",
    start_date: "",
    end_date: "",
    registration_deadline: "",
    participation_mode: "solo_or_team",
    min_team_size: 2,
    max_team_size: 5,
    max_participants: "",
    required_skills: [] as string[],
    custom_skill: "",
    prize_pool: "",
    location: "",
    image: "",
    tags: [] as string[],
    custom_tag: "",
  })

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events`)
        const data = await res.json()
        const foundEvent = data.events.find((e: Event) => e.id === eventId)
        if (foundEvent) {
          setEvent(foundEvent)
          setFormData({
            title: foundEvent.title,
            description: foundEvent.description || "",
            type: foundEvent.type || "hackathon",
            start_date: foundEvent.startDate ? new Date(foundEvent.startDate).toISOString().slice(0, 16) : "",
            end_date: foundEvent.endDate ? new Date(foundEvent.endDate).toISOString().slice(0, 16) : "",
            registration_deadline: foundEvent.registrationDeadline ? new Date(foundEvent.registrationDeadline).toISOString().slice(0, 16) : "",
            participation_mode: foundEvent.participationMode || "solo_or_team",
            min_team_size: foundEvent.minTeamSize || 2,
            max_team_size: foundEvent.maxTeamSize || 5,
            max_participants: foundEvent.maxParticipants?.toString() || "",
            required_skills: foundEvent.requiredSkills || [],
            custom_skill: "",
            prize_pool: foundEvent.prizePool?.toString() || "",
            location: foundEvent.location || "",
            image: foundEvent.image || "",
            tags: foundEvent.tags || [],
            custom_tag: "",
          })
        }
      } catch (error) {
        console.error("Error fetching event:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchEvent()
  }, [eventId])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? (value ? parseInt(value) : "") : value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleSkill = (skill: string) => {
    setFormData(prev => {
      if (prev.required_skills.includes(skill)) {
        return { ...prev, required_skills: prev.required_skills.filter(s => s !== skill) }
      } else {
        return { ...prev, required_skills: [...prev.required_skills, skill] }
      }
    })
  }

  const addCustomSkill = () => {
    if (formData.custom_skill.trim()) {
      setFormData(prev => ({
        ...prev,
        required_skills: [...prev.required_skills, prev.custom_skill.trim()],
        custom_skill: ""
      }))
    }
  }

  const toggleTag = (tag: string) => {
    setFormData(prev => {
      if (prev.tags.includes(tag)) {
        return { ...prev, tags: prev.tags.filter(t => t !== tag) }
      } else {
        return { ...prev, tags: [...prev.tags, tag] }
      }
    })
  }

  const addCustomTag = () => {
    if (formData.custom_tag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.custom_tag.trim()],
        custom_tag: ""
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          max_participants: formData.max_participants ? parseInt(formData.max_participants as any) : null,
          prize_pool: formData.prize_pool ? parseFloat(formData.prize_pool) : null,
        }),
      })

      if (res.ok) {
        setShowSuccess(true)
        setTimeout(() => {
          router.push("/dashboard/host")
        }, 2000)
      } else {
        throw new Error("Failed to update event")
      }
    } catch (error) {
      console.error("Error updating event:", error)
      alert("Failed to update event. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Event Updated Successfully!</h2>
          <p className="text-muted-foreground mb-4">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Event not found</p>
      </div>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Edit Event"
        subtitle="Update your event details"
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Basic Info */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-chart-2" />
              Basic Information
            </h3>

            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., AI Innovation Hackathon 2025"
                className="h-12 bg-secondary border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your event, theme, and what participants can expect..."
                className="min-h-32 bg-secondary border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select value={formData.type} onValueChange={(v) => handleSelectChange("type", v)}>
                  <SelectTrigger className="h-12 bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Banner Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="h-12 bg-secondary border-border"
                />
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-chart-2" />
              Event Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="h-12 bg-secondary border-border"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="h-12 bg-secondary border-border"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registration_deadline">Registration Deadline</Label>
                <Input
                  id="registration_deadline"
                  name="registration_deadline"
                  type="datetime-local"
                  value={formData.registration_deadline}
                  onChange={handleInputChange}
                  className="h-12 bg-secondary border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max_participants">Max Participants</Label>
                <Input
                  id="max_participants"
                  name="max_participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={handleInputChange}
                  placeholder="e.g., 500"
                  className="h-12 bg-secondary border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Online, San Francisco, etc."
                className="h-12 bg-secondary border-border"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participation_mode">Participation Mode</Label>
                <Select value={formData.participation_mode} onValueChange={(v) => handleSelectChange("participation_mode", v)}>
                  <SelectTrigger className="h-12 bg-secondary border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTICIPATION_MODES.map(mode => (
                      <SelectItem key={mode.value} value={mode.value}>{mode.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {formData.participation_mode !== "solo" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="min_team_size">Min Team Size</Label>
                    <Input
                      id="min_team_size"
                      name="min_team_size"
                      type="number"
                      value={formData.min_team_size}
                      onChange={handleInputChange}
                      className="h-12 bg-secondary border-border"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="max_team_size">Max Team Size</Label>
                    <Input
                      id="max_team_size"
                      name="max_team_size"
                      type="number"
                      value={formData.max_team_size}
                      onChange={handleInputChange}
                      className="h-12 bg-secondary border-border"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Required Skills */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-chart-2" />
              Required Skills
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              {DEFAULT_REQUIRED_SKILLS.map(skill => (
                <Badge
                  key={skill}
                  variant={formData.required_skills.includes(skill) ? "default" : "outline"}
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={formData.custom_skill}
                onChange={(e) => setFormData(prev => ({ ...prev, custom_skill: e.target.value }))}
                placeholder="Add custom skill..."
                className="h-12 bg-secondary border-border"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addCustomSkill()
                  }
                }}
              />
              <Button type="button" onClick={addCustomSkill} className="h-12">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-chart-2" />
              Tags
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              {["AI", "Web3", "FinTech", "Climate", "Health", "Education", "Social Impact"].map(tag => (
                <Badge
                  key={tag}
                  variant={formData.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={formData.custom_tag}
                onChange={(e) => setFormData(prev => ({ ...prev, custom_tag: e.target.value }))}
                placeholder="Add custom tag..."
                className="h-12 bg-secondary border-border"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addCustomTag()
                  }
                }}
              />
              <Button type="button" onClick={addCustomTag} className="h-12">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Prize Pool */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-chart-4" />
              Prize Pool
            </h3>

            <div className="space-y-2">
              <Label htmlFor="prize_pool">Total Prize Pool (USD)</Label>
              <Input
                id="prize_pool"
                name="prize_pool"
                type="number"
                value={formData.prize_pool}
                onChange={handleInputChange}
                placeholder="e.g., 10000"
                className="h-12 bg-secondary border-border"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 glow-border" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {isSubmitting ? "Updating..." : "Update Event"}
            </Button>
          </div>
        </motion.div>

        {/* Preview & Tips */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* AI Suggestions */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">AI Suggestions</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-muted-foreground">
                  Hackathons lasting 48-72 hours tend to have the highest completion rates.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-muted-foreground">
                  Consider adding mentor office hours to increase participant engagement.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-muted-foreground">
                  AI/ML and Web3 are trending domains with high participant interest.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="glass-card p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <LinkIcon className="w-5 h-5 text-primary" />
              Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>Be specific about the problem statement</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>Include judging criteria</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>Set clear deadlines</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </form>
    </>
  )
}
