"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  MapPin,
  Link as LinkIcon,
  Github,
  Twitter,
  Linkedin,
  Edit2,
  Camera,
  Trophy,
  Award,
  Star,
  Wallet,
  ExternalLink,
  CheckCircle2,
  Loader2,
  X,
  Globe,
  Folder,
  FileText,
  Sparkles,
  Lightbulb,
  Plus,
  Target,
  Users,
  User,
  Brain,
  TrendingUp,
  Upload,
  Calendar,
  Building
} from "lucide-react"

interface UserData {
  id?: string
  name?: string
  email?: string
  avatar?: string
  bio?: string
}

interface ProfileData {
  college?: string
  degree?: string
  branch?: string
  year?: string
  passoutYear?: string
  dateOfBirth?: string
  resume?: string
  portfolio?: string
  github?: string
  linkedin?: string
  twitter?: string
  skills?: string[]
  interests?: string[]
  website?: string
  location?: string
  socialLinks?: Record<string, string>
  primaryDomain?: string
  lookingFor?: string[]
}

interface CombinedData {
  user: UserData
  profile: ProfileData
}

const defaultUserData: UserData = {
  name: "",
  email: "",
  avatar: "",
  bio: ""
}

const defaultProfileData: ProfileData = {
  college: "",
  degree: "",
  branch: "",
  year: "",
  passoutYear: "",
  dateOfBirth: "",
  resume: "",
  portfolio: "",
  github: "",
  linkedin: "",
  twitter: "",
  skills: [],
  interests: [],
  website: "",
  location: "",
  socialLinks: {},
  primaryDomain: "",
  lookingFor: []
}

const defaultProfileDataCombined: CombinedData = {
  user: defaultUserData,
  profile: defaultProfileData
}

const mockStats = {
  hackathons: 8,
  submissions: 12,
  badges: 10,
  rank: 2,
  points: 2320,
}

// Skill Categories
const SKILL_CATEGORIES = [
  {
    name: "Technology",
    skills: [
      "AI/ML", "Web Development", "Mobile Development",
      "Cybersecurity", "Cloud Computing", "Blockchain",
      "Data Science", "UI/UX"
    ]
  },
  {
    name: "Engineering",
    skills: [
      "Mechanical", "Civil", "Electrical",
      "Electronics", "Robotics", "Automotive"
    ]
  },
  {
    name: "Business",
    skills: [
      "Marketing", "Finance", "Entrepreneurship",
      "Sales", "Product Management"
    ]
  },
  {
    name: "Creative",
    skills: [
      "Design", "Video Editing", "Content Creation",
      "Animation", "Photography"
    ]
  },
  {
    name: "Research",
    skills: [
      "Scientific Research", "Academic Writing", "Data Analysis"
    ]
  }
]

// Interest Categories
const INTEREST_CATEGORIES = [
  {
    name: "Tech & Innovation",
    interests: [
      "Hackathons", "Startups", "AI", "Blockchain",
      "Research", "Space Tech", "FinTech", "EdTech",
      "Robotics", "Gaming", "Open Source"
    ]
  },
  {
    name: "Social & Impact",
    interests: [
      "Sustainability", "Healthcare", "Community Building",
      "Innovation"
    ]
  },
  {
    name: "Business & Growth",
    interests: [
      "Marketing", "Sales", "Product Management", "Venture Capital"
    ]
  }
]

// Primary Domains
const PRIMARY_DOMAINS = [
  "Technology",
  "Engineering",
  "Business",
  "Design",
  "Research",
  "Healthcare",
  "Education",
  "Law",
  "Agriculture",
  "Science",
  "Media",
  "Other"
]

// Looking For Options
const LOOKING_FOR_OPTIONS = [
  "Teammates",
  "Mentors",
  "Startup Co-Founders",
  "Project Collaborators",
  "Internships",
  "Research Partners",
  "Hackathon Teams",
  "Investors",
  "Community Building"
]

// Function to calculate match score between event and user profile
function calculateEventMatchScore(event: any, userProfile: any): number {
  let score = 50; // Base score
  
  // Match by primary domain
  if (userProfile.primaryDomain) {
    const domainKeywords = {
      "Technology": ["AI", "ML", "Blockchain", "Web", "Cloud"],
      "Engineering": ["Robotics", "Hardware", "Mechanical"],
      "Business": ["Startup", "Finance", "Marketing"],
      "Design": ["UI/UX", "Design"],
      "Healthcare": ["Health", "Medical", "BioTech"],
      "Science": ["Research", "Science"],
      "Media": ["Content", "Media", "Gaming"],
    };
    const domain = userProfile.primaryDomain as keyof typeof domainKeywords;
    if (domainKeywords[domain]) {
      const matches = domainKeywords[domain].some(keyword => 
        event.title?.toLowerCase().includes(keyword.toLowerCase()) || 
        event.description?.toLowerCase().includes(keyword.toLowerCase())
      );
      if (matches) score += 15;
    }
  }
  
  // Match by skills
  const userSkills = userProfile.skills || [];
  const eventSkills = event.requiredSkills || [];
  const skillOverlap = userSkills.filter((skill: string) => 
    eventSkills.some((eventSkill: string) => 
      eventSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(eventSkill.toLowerCase())
    )
  ).length;
  score += Math.min(skillOverlap * 5, 20);
  
  // Match by interests
  const userInterests = userProfile.interests || [];
  const interestOverlap = userInterests.filter((interest: string) =>
    event.title?.toLowerCase().includes(interest.toLowerCase()) || 
    event.description?.toLowerCase().includes(interest.toLowerCase())
  ).length;
  score += Math.min(interestOverlap * 3, 15);
  
  // Cap at 100
  return Math.min(Math.max(score, 0), 100);
}

export default function ProfilePage() {
  const [data, setData] = useState<CombinedData>(defaultProfileDataCombined)
  const [formData, setFormData] = useState<CombinedData>(defaultProfileDataCombined)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showCustomSkill, setShowCustomSkill] = useState(false)
  const [customSkill, setCustomSkill] = useState("")
  const [showCustomInterest, setShowCustomInterest] = useState(false)
  const [customInterest, setCustomInterest] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeDragOver, setResumeDragOver] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)

  useEffect(() => {
    fetchProfile()
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const response = await fetch('/api/events')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoadingEvents(false)
    }
  }

  function sanitizeValue(value: any): string {
    return value ?? "";
  }
  function sanitizeArray(value: any): string[] {
    return value ?? [];
  }
  function sanitizeObject(value: any): Record<string, string> {
    return value ?? {};
  }

  // Handle Resume and Avatar file handlers
  function handleResumeDrop(e: React.DragEvent) {
    e.preventDefault()
    setResumeDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && files[0].type === 'application/pdf') {
      setResumeFile(files[0])
    }
  }

  function handleResumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0])
    }
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
        handleChange('user', 'avatar', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  function removeResume() {
    setResumeFile(null)
  }

  async function fetchProfile() {
    try {
      console.log('fetchProfile - Starting...')
      const response = await fetch("/api/profile")
      if (response.ok) {
        const result = await response.json()
        console.log('fetchProfile - API result:', result)
        const normalizedData = {
          user: {
            ...defaultUserData,
            id: result.user?.id,
            name: sanitizeValue(result.user?.name),
            email: sanitizeValue(result.user?.email),
            avatar: sanitizeValue(result.user?.avatar),
            bio: sanitizeValue(result.user?.bio),
          },
          profile: {
            ...defaultProfileData,
            college: sanitizeValue(result.profile?.college),
            degree: sanitizeValue(result.profile?.degree),
            branch: sanitizeValue(result.profile?.branch),
            year: sanitizeValue(result.profile?.year),
            passoutYear: sanitizeValue(result.profile?.passoutYear),
            dateOfBirth: sanitizeValue(result.profile?.dateOfBirth),
            resume: sanitizeValue(result.profile?.resume),
            portfolio: sanitizeValue(result.profile?.portfolio),
            github: sanitizeValue(result.profile?.github),
            linkedin: sanitizeValue(result.profile?.linkedin),
            twitter: sanitizeValue(result.profile?.twitter),
            skills: sanitizeArray(result.profile?.skills),
            interests: sanitizeArray(result.profile?.interests),
            website: sanitizeValue(result.profile?.website),
            location: sanitizeValue(result.profile?.location),
            socialLinks: sanitizeObject(result.profile?.socialLinks),
            primaryDomain: sanitizeValue(result.profile?.primaryDomain),
            lookingFor: sanitizeArray(result.profile?.lookingFor),
          }
        }
        console.log('fetchProfile - normalizedData:', normalizedData)
        setData(normalizedData)
        setFormData(normalizedData)
        if (normalizedData.user.avatar) {
          setAvatarPreview(normalizedData.user.avatar)
        }
        console.log('fetchProfile - setFormData complete')
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleChange(
    section: 'user' | 'profile',
    field: string,
    value: string | string[]
  ) {
    console.log('handleChange CALLED!', { section, field, value })
    setFormData(prev => {
      const newData = {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }
      console.log('handleChange - new formData:', newData)
      return newData
    })
  }

  function toggleSkill(skill: string) {
    setFormData(prev => {
      const currentSkills = prev.profile.skills || []
      const newSkills = currentSkills.includes(skill)
        ? currentSkills.filter(s => s !== skill)
        : [...currentSkills, skill]
      return {
        ...prev,
        profile: {
          ...prev.profile,
          skills: newSkills
        }
      }
    })
  }

  function addCustomSkill() {
    if (customSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          skills: [...(prev.profile.skills || []), customSkill.trim()]
        }
      }))
      setCustomSkill("")
      setShowCustomSkill(false)
    }
  }

  function removeSkill(skillToRemove: string) {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        skills: prev.profile.skills?.filter(skill => skill !== skillToRemove) || []
      }
    }))
  }

  function toggleInterest(interest: string) {
    setFormData(prev => {
      const currentInterests = prev.profile.interests || []
      const newInterests = currentInterests.includes(interest)
        ? currentInterests.filter(i => i !== interest)
        : [...currentInterests, interest]
      return {
        ...prev,
        profile: {
          ...prev.profile,
          interests: newInterests
        }
      }
    })
  }

  function addCustomInterest() {
    if (customInterest.trim()) {
      setFormData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          interests: [...(prev.profile.interests || []), customInterest.trim()]
        }
      }))
      setCustomInterest("")
      setShowCustomInterest(false)
    }
  }

  function removeInterest(interestToRemove: string) {
    setFormData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        interests: prev.profile.interests?.filter(interest => interest !== interestToRemove) || []
      }
    }))
  }

  function toggleLookingFor(option: string) {
    setFormData(prev => {
      const current = prev.profile.lookingFor || []
      const newLookingFor = current.includes(option)
        ? current.filter(o => o !== option)
        : [...current, option]
      return {
        ...prev,
        profile: {
          ...prev.profile,
          lookingFor: newLookingFor
        }
      }
    })
  }

  function calculateProfileScore() {
    let score = 0
    let total = 0

    // User fields
    const userFields = ['name', 'avatar', 'bio']
    userFields.forEach(field => {
      total++
      if (formData.user[field as keyof typeof formData.user]) {
        score++
      }
    })

    // Profile fields
    const profileFields = ['college', 'degree', 'branch', 'passoutYear', 'dateOfBirth', 'resume', 'portfolio', 'github', 'linkedin', 'location', 'primaryDomain']
    profileFields.forEach(field => {
      total++
      if (formData.profile[field as keyof typeof formData.profile]) {
        score++
      }
    })

    // Skills and interests
    total += 2
    if (formData.profile.skills && formData.profile.skills.length >= 3) score++
    if (formData.profile.interests && formData.profile.interests.length >= 2) score++

    // Looking for
    total++
    if (formData.profile.lookingFor && formData.profile.lookingFor.length > 0) score++

    return Math.round((score / total) * 100)
  }

  function getProfileInsights() {
    const insights: string[] = []
    const score = calculateProfileScore()

    if (score < 50) {
      insights.push("Your profile is just getting started! Let's add more details.")
    } else if (score < 80) {
      insights.push("Great progress! A few more details will make your profile shine.")
    } else {
      insights.push("Excellent profile! You're ready for AI-powered connections.")
    }

    if (!formData.profile.skills || formData.profile.skills.length < 3) {
      insights.push("Add 2 more skills to improve AI team matching by 24%.")
    }

    if (!formData.profile.resume) {
      insights.push("Upload your resume to unlock advanced teammate recommendations.")
    }

    if (!formData.profile.github) {
      insights.push("Add your GitHub profile to showcase your work.")
    }

    if (!formData.profile.linkedin) {
      insights.push("Connect LinkedIn to increase your professional credibility.")
    }

    if (!formData.profile.primaryDomain) {
      insights.push("Select your primary domain to get personalized AI event recommendations.")
    }

    if (!formData.profile.lookingFor || formData.profile.lookingFor.length === 0) {
      insights.push("Tell us what you're looking for to unlock targeted opportunities.")
    }

    return insights
  }

  async function handleSaveProfile() {
    console.log('handleSaveProfile - Starting')
    console.log('handleSaveProfile - FULL formData:', formData)
    setIsSaving(true)
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: formData.user, profile: formData.profile }),
      })

      console.log('handleSaveProfile - Response:', response)

      if (response.ok) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
        await fetchProfile()
      }
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const displayName = data.user.name || "User"
  const initial = displayName.charAt(0)
  const profileScore = calculateProfileScore()
  const insights = getProfileInsights()

  return (
    <>
      <DashboardHeader
        title="Profile"
        subtitle="Your AI-powered innovation identity"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card & AI Insights */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card overflow-hidden border-primary/20">
              <div className="relative bg-gradient-to-r from-primary/20 via-secondary/10 to-primary/20 p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-32 w-32 border-4 border-primary/50 shadow-[0_0_30px_rgba(74,222,128,0.3)]">
                    <AvatarImage src={avatarPreview || data.user.avatar} alt={displayName} />
                    <AvatarFallback className="text-4xl bg-primary/20 text-primary">{initial}</AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-1 right-1 h-10 w-10 rounded-full cursor-pointer bg-background border-2 border-primary/50 flex items-center justify-center hover:bg-primary/10 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <Camera className="w-5 h-5 text-primary" />
                  </label>
                </div>
                <h2 className="text-2xl font-bold mb-1">{displayName}</h2>
                <p className="text-muted-foreground mb-2">{data.user.email}</p>
                {data.profile.primaryDomain && (
                  <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
                    {data.profile.primaryDomain}
                  </Badge>
                )}
                {data.user.bio && (
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">{data.user.bio}</p>
                )}

                {data.profile.location && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                    <MapPin className="w-4 h-4" />
                    {data.profile.location}
                  </div>
                )}

                {/* Social Links */}
                <div className="flex justify-center gap-2 mt-4">
                  {data.profile.github && (
                    <Button variant="outline" size="icon" className="border-primary/30 hover:border-primary hover:bg-primary/10">
                      <Github className="h-4 w-4" />
                    </Button>
                  )}
                  {data.profile.linkedin && (
                    <Button variant="outline" size="icon" className="border-primary/30 hover:border-primary hover:bg-primary/10">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  )}
                  {data.profile.website && (
                    <Button variant="outline" size="icon" className="border-primary/30 hover:border-primary hover:bg-primary/10">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {/* Wallet */}
                <div className="p-3 rounded-lg bg-secondary/30 border border-border mb-4">
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span className="font-mono">0x...5678</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-secondary/30 border border-border">
                    <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold">{mockStats.hackathons}</p>
                    <p className="text-xs text-muted-foreground">Hackathons</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/30 border border-border">
                    <Award className="w-5 h-5 text-chart-2 mx-auto mb-1" />
                    <p className="text-lg font-bold">{mockStats.badges}</p>
                    <p className="text-xs text-muted-foreground">Badges</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/30 border border-border">
                    <Star className="w-5 h-5 text-chart-4 mx-auto mb-1" />
                    <p className="text-lg font-bold">#{mockStats.rank}</p>
                    <p className="text-xs text-muted-foreground">Rank</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary/30 border border-border">
                    <TrendingUp className="w-5 h-5 text-chart-1 mx-auto mb-1" />
                    <p className="text-lg font-bold">{mockStats.points}</p>
                    <p className="text-xs text-muted-foreground">Points</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* AI Insights Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card border-primary/30 bg-gradient-to-br from-card via-secondary/20 to-card shadow-[0_0_30px_rgba(74,222,128,0.1)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  Nexus AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.slice(0, 4).map((insight, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-secondary/20 border border-border/50">
                      <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Bar with Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between"
          >
            <div></div>
            <Button
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : showSuccess ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Edit2 className="w-4 h-4" />
              )}
              {isSaving ? "Saving..." : showSuccess ? "Saved!" : "Save Changes"}
            </Button>
          </motion.div>

          {/* Profile Completion Ring & Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card border-primary/30 bg-gradient-to-br from-card via-secondary/20 to-card shadow-[0_0_30px_rgba(74,222,128,0.1)]">
              <CardContent className="pt-6">
                <div className="flex items-center gap-8">
                  {/* Circular Progress Ring */}
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="hsl(var(--muted))"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="hsl(var(--primary))"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(profileScore / 100) * 351.86} 351.86`}
                        className="transition-all duration-1000"
                        style={{ filter: 'drop-shadow(0 0 10px rgba(74, 222, 128, 0.5))' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-primary">{profileScore}%</span>
                      <span className="text-xs text-muted-foreground">Complete</span>
                    </div>
                  </div>

                  {/* Score Details */}
                  <div className="flex-1 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span>Skills Coverage</span>
                        <span className="text-primary">{Math.min((formData.profile.skills?.length || 0) * 15, 100)}%</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${Math.min((formData.profile.skills?.length || 0) * 15, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span>Professional Presence</span>
                        <span className="text-primary">{formData.profile.github || formData.profile.linkedin ? 85 : 30}%</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${formData.profile.github || formData.profile.linkedin ? 85 : 30}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span>Event Readiness</span>
                        <span className="text-primary">{formData.profile.resume ? 100 : 40}%</span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all"
                          style={{ width: `${formData.profile.resume ? 100 : 40}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.user.name}
                      onChange={(e) => handleChange('user', 'name', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={data.user.email} disabled className="bg-secondary/50 border-border cursor-not-allowed" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.user.bio}
                    onChange={(e) => handleChange('user', 'bio', e.target.value)}
                    className="bg-secondary border-border min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.profile.location}
                      onChange={(e) => handleChange('profile', 'location', e.target.value)}
                      className="bg-secondary border-border"
                      placeholder="City, Country"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="college">College / School</Label>
                    <Input
                      id="college"
                      value={formData.profile.college}
                      onChange={(e) => handleChange('profile', 'college', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree</Label>
                    <Input
                      id="degree"
                      value={formData.profile.degree}
                      onChange={(e) => handleChange('profile', 'degree', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch / Stream</Label>
                    <Input
                      id="branch"
                      value={formData.profile.branch}
                      onChange={(e) => handleChange('profile', 'branch', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Current Year</Label>
                    <Input
                      id="year"
                      value={formData.profile.year}
                      onChange={(e) => handleChange('profile', 'year', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passoutYear">Passout Year</Label>
                    <Input
                      id="passoutYear"
                      value={formData.profile.passoutYear}
                      onChange={(e) => handleChange('profile', 'passoutYear', e.target.value)}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.profile.dateOfBirth}
                    onChange={(e) => handleChange('profile', 'dateOfBirth', e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Primary Domain */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Primary Domain
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {PRIMARY_DOMAINS.map((domain) => {
                    const isSelected = formData.profile.primaryDomain === domain
                    return (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => handleChange('profile', 'primaryDomain', domain)}
                        className={`
                          p-4 rounded-xl border text-sm font-medium transition-all
                          ${isSelected
                            ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(74,222,128,0.2)]'
                            : 'bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50 hover:border-primary/30'
                          }
                        `}
                      >
                        {domain}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Looking For */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Looking For
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {LOOKING_FOR_OPTIONS.map((option) => {
                    const isSelected = formData.profile.lookingFor?.includes(option)
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleLookingFor(option)}
                        className={`
                          px-4 py-2 rounded-full text-sm font-medium transition-all border
                          ${isSelected
                            ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(74,222,128,0.2)]'
                            : 'bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50 hover:border-primary/30'
                          }
                        `}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resume Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Upload className="w-5 h-5 text-primary" />
                  Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resumeFile || formData.profile.resume ? (
                  <div className="flex items-center gap-3 p-4 bg-secondary/30 border border-primary/30 rounded-xl">
                    <FileText className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium flex items-center gap-2">
                        {resumeFile ? resumeFile.name : "Resume uploaded"}
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {resumeFile ? `${(resumeFile.size / 1024 / 1024).toFixed(2)} MB` : "Click save to update"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={removeResume} type="button" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setResumeDragOver(true)
                    }}
                    onDragLeave={() => setResumeDragOver(false)}
                    onDrop={handleResumeDrop}
                    className={`
                      p-8 border-2 border-dashed rounded-xl text-center transition-all
                      ${resumeDragOver
                        ? 'border-primary bg-primary/10'
                        : 'border-muted-foreground/30 bg-secondary/20 hover:border-primary/50 hover:bg-secondary/30'
                      }
                    `}
                  >
                    <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm mb-2">Drag & drop your PDF resume here, or</p>
                    <label className="cursor-pointer">
                      <Button variant="default" size="sm" type="button" asChild>
                        <span>
                          <input
                            id="resume"
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={handleResumeChange}
                          />
                          Browse Files
                        </span>
                      </Button>
                    </label>
                    <p className="text-xs text-muted-foreground mt-3">
                      PDF only • Max 5MB
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-primary" />
                  Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      value={formData.profile.website}
                      onChange={(e) => handleChange('profile', 'website', e.target.value)}
                      className="bg-secondary border-border"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio" className="flex items-center gap-2">
                      <Folder className="w-3.5 h-3.5 text-muted-foreground" />
                      Portfolio
                    </Label>
                    <Input
                      id="portfolio"
                      value={formData.profile.portfolio}
                      onChange={(e) => handleChange('profile', 'portfolio', e.target.value)}
                      className="bg-secondary border-border"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github" className="flex items-center gap-2">
                      <Github className="w-3.5 h-3.5 text-muted-foreground" />
                      GitHub
                    </Label>
                    <Input
                      id="github"
                      value={formData.profile.github}
                      onChange={(e) => handleChange('profile', 'github', e.target.value)}
                      className="bg-secondary border-border"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="w-3.5 h-3.5 text-muted-foreground" />
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      value={formData.profile.linkedin}
                      onChange={(e) => handleChange('profile', 'linkedin', e.target.value)}
                      className="bg-secondary border-border"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="flex items-center gap-2">
                      <Twitter className="w-3.5 h-3.5 text-muted-foreground" />
                      X/Twitter
                    </Label>
                    <Input
                      id="twitter"
                      value={formData.profile.twitter}
                      onChange={(e) => handleChange('profile', 'twitter', e.target.value)}
                      className="bg-secondary border-border"
                      placeholder="https://x.com/..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Skills */}
                {formData.profile.skills && formData.profile.skills.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Selected Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.profile.skills?.map((skill, index) => (
                        <Badge
                          key={`skill-${index}`}
                          variant="secondary"
                          className="text-sm flex items-center gap-2 bg-primary/20 border-primary/30 text-primary px-3 py-1"
                        >
                          {skill}
                          <X
                            className="w-3.5 h-3.5 cursor-pointer hover:text-red-400 transition-colors"
                            onClick={(e) => {
                              e.preventDefault()
                              removeSkill(skill)
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skill Categories */}
                {SKILL_CATEGORIES.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">{category.name}</Label>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => {
                        const isSelected = formData.profile.skills?.includes(skill)
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`
                              px-4 py-2 rounded-full text-sm transition-all border
                              ${isSelected
                                ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(74,222,128,0.2)]'
                                : 'bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50 hover:border-primary/30'
                              }
                            `}
                          >
                            {skill}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {/* Custom Skill */}
                <div className="space-y-2">
                  {!showCustomSkill ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCustomSkill(true)}
                      className="gap-2 border-dashed border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <Plus className="w-4 h-4" />
                      Add Custom Skill
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        placeholder="Enter your custom skill..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addCustomSkill()
                          }
                        }}
                        className="bg-secondary border-border"
                        autoFocus
                      />
                      <Button variant="default" type="button" onClick={addCustomSkill}>
                        Add Skill
                      </Button>
                      <Button variant="outline" type="button" onClick={() => setShowCustomSkill(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Interests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Interests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Interests */}
                {formData.profile.interests && formData.profile.interests.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Selected Interests</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.profile.interests?.map((interest, index) => (
                        <Badge
                          key={`interest-${index}`}
                          variant="outline"
                          className="text-sm flex items-center gap-2 bg-primary/10 border-primary/30 px-3 py-1"
                        >
                          {interest}
                          <X
                            className="w-3.5 h-3.5 cursor-pointer hover:text-red-400 transition-colors"
                            onClick={(e) => {
                              e.preventDefault()
                              removeInterest(interest)
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interest Categories */}
                {INTEREST_CATEGORIES.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">{category.name}</Label>
                    <div className="flex flex-wrap gap-2">
                      {category.interests.map((interest) => {
                        const isSelected = formData.profile.interests?.includes(interest)
                        return (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => toggleInterest(interest)}
                            className={`
                              px-4 py-2 rounded-full text-sm transition-all border
                              ${isSelected
                                ? 'bg-primary/15 border-primary text-primary shadow-[0_0_15px_rgba(74,222,128,0.2)]'
                                : 'bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50 hover:border-primary/30'
                              }
                            `}
                          >
                            {interest}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {/* Custom Interest */}
                <div className="space-y-2">
                  {!showCustomInterest ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCustomInterest(true)}
                      className="gap-2 border-dashed border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <Plus className="w-4 h-4" />
                      Add Custom Interest
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={customInterest}
                        onChange={(e) => setCustomInterest(e.target.value)}
                        placeholder="Enter your custom interest..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addCustomInterest()
                          }
                        }}
                        className="bg-secondary border-border"
                        autoFocus
                      />
                      <Button variant="default" type="button" onClick={addCustomInterest}>
                        Add Interest
                      </Button>
                      <Button variant="outline" type="button" onClick={() => setShowCustomInterest(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Event Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  AI Event Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingEvents ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : events.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No upcoming events available</p>
                ) : (
                  <div className="space-y-3">
                    {events
                      .map(event => ({
                        ...event,
                        match: calculateEventMatchScore(event, formData.profile)
                      }))
                      .sort((a, b) => b.match - a.match)
                      .slice(0, 5)
                      .map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              {event.match}% Match
                            </Badge>
                            <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}
