"use client"

import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Sparkles,
} from "lucide-react"

const moderationItems = [
  {
    id: 1,
    type: "spam",
    severity: "high",
    title: "Suspicious Submission Pattern",
    description: "Multiple submissions from same IP with similar content detected",
    project: "Quick Money App",
    team: "Anonymous123",
    timestamp: "2 minutes ago",
    aiConfidence: 94,
    status: "pending",
  },
  {
    id: 2,
    type: "plagiarism",
    severity: "high",
    title: "Potential Code Plagiarism",
    description: "87% similarity with existing GitHub repository detected",
    project: "Todo App Pro",
    team: "FastCoders",
    timestamp: "15 minutes ago",
    aiConfidence: 87,
    status: "pending",
  },
  {
    id: 3,
    type: "quality",
    severity: "medium",
    title: "Low Quality Submission",
    description: "Minimal documentation and incomplete features detected",
    project: "Weather Dashboard",
    team: "NewDevs",
    timestamp: "1 hour ago",
    aiConfidence: 72,
    status: "reviewing",
  },
  {
    id: 4,
    type: "content",
    severity: "low",
    title: "Content Review Required",
    description: "Project description may need clarification",
    project: "AI Assistant",
    team: "TechMinds",
    timestamp: "3 hours ago",
    aiConfidence: 58,
    status: "resolved",
  },
]

const stats = [
  { label: "Total Reviewed", value: "156", icon: Eye },
  { label: "Pending", value: "4", icon: Clock },
  { label: "Approved", value: "148", icon: CheckCircle },
  { label: "Flagged", value: "4", icon: AlertTriangle },
]

export default function ModerationPage() {
  return (
    <>
      <DashboardHeader
        title="AI Moderation"
        subtitle="Automated submission review and fraud detection"
      />

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        {stats.map((stat, index) => (
          <div key={stat.label} className="glass-card p-4">
            <stat.icon className="w-5 h-5 text-chart-2 mb-2" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Moderation Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              Live Moderation Feed
            </h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm text-muted-foreground">Live</span>
            </div>
          </div>

          {moderationItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-card p-4 border-l-4 ${
                item.severity === "high"
                  ? "border-l-destructive"
                  : item.severity === "medium"
                  ? "border-l-chart-4"
                  : "border-l-muted"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      item.severity === "high"
                        ? "bg-destructive/10"
                        : item.severity === "medium"
                        ? "bg-chart-4/10"
                        : "bg-secondary"
                    }`}
                  >
                    <AlertTriangle
                      className={`w-5 h-5 ${
                        item.severity === "high"
                          ? "text-destructive"
                          : item.severity === "medium"
                          ? "text-chart-4"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline">{item.type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.project} by {item.team}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{item.aiConfidence}%</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Badge
                  variant={
                    item.status === "pending"
                      ? "destructive"
                      : item.status === "reviewing"
                      ? "default"
                      : "secondary"
                  }
                >
                  {item.status}
                </Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                  {item.status !== "resolved" && (
                    <>
                      <Button size="sm" variant="outline" className="text-primary hover:text-primary">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Detection Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">AI Detection</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: "Spam Detection", value: 98, color: "bg-primary" },
                { label: "Plagiarism Check", value: 95, color: "bg-chart-2" },
                { label: "Quality Analysis", value: 89, color: "bg-chart-4" },
                { label: "Content Moderation", value: 92, color: "bg-chart-5" },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{metric.label}</span>
                    <span className="text-sm font-medium">{metric.value}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full ${metric.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Detection Types</h3>
            <div className="space-y-3">
              {[
                { type: "Spam", count: 12, color: "text-destructive" },
                { type: "Plagiarism", count: 8, color: "text-chart-4" },
                { type: "Low Quality", count: 15, color: "text-chart-2" },
                { type: "Content Issues", count: 5, color: "text-muted-foreground" },
              ].map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between p-2 rounded-lg bg-secondary/50"
                >
                  <span className="text-sm">{item.type}</span>
                  <span className={`text-sm font-bold ${item.color}`}>{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
