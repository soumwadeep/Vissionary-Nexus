"use client"

import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Trophy, Users, FileText, Sparkles, Upload, Link as LinkIcon } from "lucide-react"

export default function CreateEventPage() {
  return (
    <>
      <DashboardHeader
        title="Create Event"
        subtitle="Set up a new hackathon or innovation challenge"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-card p-6"
        >
          <form className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-chart-2" />
                Basic Information
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., AI Innovation Hackathon 2025"
                  className="h-12 bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event, theme, and what participants can expect..."
                  className="min-h-32 bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label>Event Banner</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-chart-2/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-chart-2" />
                Event Details
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    className="h-12 bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    className="h-12 bg-secondary border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="domains">Domains/Categories</Label>
                <Input
                  id="domains"
                  placeholder="e.g., AI, Web3, FinTech (comma separated)"
                  className="h-12 bg-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  placeholder="e.g., 500"
                  className="h-12 bg-secondary border-border"
                />
              </div>
            </div>

            {/* Prize Pool */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-chart-4" />
                Prize Pool
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstPrize">1st Place</Label>
                  <Input
                    id="firstPrize"
                    placeholder="e.g., $5,000"
                    className="h-12 bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondPrize">2nd Place</Label>
                  <Input
                    id="secondPrize"
                    placeholder="e.g., $3,000"
                    className="h-12 bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thirdPrize">3rd Place</Label>
                  <Input
                    id="thirdPrize"
                    placeholder="e.g., $2,000"
                    className="h-12 bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialPrizes">Special Prizes</Label>
                  <Input
                    id="specialPrizes"
                    placeholder="e.g., Best UI, Most Innovative"
                    className="h-12 bg-secondary border-border"
                  />
                </div>
              </div>
            </div>

            {/* Blockchain Rewards */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="font-semibold flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-primary" />
                Blockchain Rewards
              </h3>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">NFT Achievement Badges</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Participants will automatically receive NFT badges for participation,
                      completion, and winning positions via Somnia blockchain.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <Button variant="outline" className="flex-1">
                Save Draft
              </Button>
              <Button className="flex-1 glow-border">
                Publish Event
              </Button>
            </div>
          </form>
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

          {/* Judging Criteria */}
          <div className="glass-card p-6">
            <h3 className="font-semibold flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-chart-2" />
              Default Judging Criteria
            </h3>
            <div className="space-y-3">
              {[
                { name: "Innovation", weight: 25 },
                { name: "Technical Complexity", weight: 25 },
                { name: "Originality", weight: 20 },
                { name: "Scalability", weight: 15 },
                { name: "Presentation", weight: 15 },
              ].map((criteria) => (
                <div key={criteria.name} className="flex items-center justify-between">
                  <span className="text-sm">{criteria.name}</span>
                  <span className="text-sm text-chart-2 font-medium">{criteria.weight}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
