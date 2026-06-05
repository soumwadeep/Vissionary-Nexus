"use client"

import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Mail, 
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
  ExternalLink
} from "lucide-react"

const profileData = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  username: "@alexjohnson",
  bio: "Full-stack developer passionate about AI and blockchain. Building the future one hackathon at a time.",
  location: "San Francisco, CA",
  website: "https://alexjohnson.dev",
  github: "alexjohnson",
  twitter: "alexjohnson",
  linkedin: "alexjohnson",
  walletAddress: "0x1234...5678",
  avatar: "/placeholder-user.png",
  stats: {
    hackathons: 8,
    submissions: 12,
    badges: 10,
    rank: 2,
    points: 2320,
  },
  skills: ["React", "TypeScript", "Node.js", "Python", "Solidity", "AI/ML"],
  interests: ["Blockchain", "AI", "Web3", "DeFi", "Healthcare Tech"],
}

export default function ProfilePage() {
  return (
    <>
      <DashboardHeader
        title="Profile"
        subtitle="Manage your public profile and settings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="glass-card p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="h-24 w-24 border-4 border-primary/30">
                <AvatarImage src={profileData.avatar} alt={profileData.name} />
                <AvatarFallback className="text-2xl">{profileData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-bold mb-1">{profileData.name}</h2>
            <p className="text-muted-foreground mb-4">{profileData.username}</p>
            <p className="text-sm text-muted-foreground mb-4">{profileData.bio}</p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="w-4 h-4" />
              {profileData.location}
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-2 mb-6">
              <Button variant="outline" size="icon">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <LinkIcon className="h-4 w-4" />
              </Button>
            </div>

            {/* Wallet */}
            <div className="p-3 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="font-mono">{profileData.walletAddress}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mt-6"
          >
            <h3 className="font-semibold mb-4">Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold">{profileData.stats.hackathons}</p>
                <p className="text-xs text-muted-foreground">Hackathons</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <Award className="w-5 h-5 text-chart-2 mx-auto mb-1" />
                <p className="text-lg font-bold">{profileData.stats.badges}</p>
                <p className="text-xs text-muted-foreground">Badges</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <Star className="w-5 h-5 text-chart-4 mx-auto mb-1" />
                <p className="text-lg font-bold">#{profileData.stats.rank}</p>
                <p className="text-xs text-muted-foreground">Rank</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <div className="w-5 h-5 text-chart-1 mx-auto mb-1 font-bold">XP</div>
                <p className="text-lg font-bold">{profileData.stats.points}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Edit Profile</h3>
              <Button className="gap-2">
                <Edit2 className="w-4 h-4" />
                Save Changes
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={profileData.name} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={profileData.username} className="bg-secondary border-border" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={profileData.email} className="bg-secondary border-border" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  defaultValue={profileData.bio} 
                  className="bg-secondary border-border min-h-[100px]" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue={profileData.location} className="bg-secondary border-border" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" defaultValue={profileData.website} className="bg-secondary border-border" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <Input id="github" defaultValue={profileData.github} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input id="twitter" defaultValue={profileData.twitter} className="bg-secondary border-border" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" defaultValue={profileData.linkedin} className="bg-secondary border-border" />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="text-xs">
                    + Add Skill
                  </Button>
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {profileData.interests.map((interest) => (
                    <Badge key={interest} variant="outline" className="text-sm">
                      {interest}
                    </Badge>
                  ))}
                  <Button variant="outline" size="sm" className="text-xs">
                    + Add Interest
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
