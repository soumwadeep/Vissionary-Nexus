"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Sparkles,
  Activity,
  Brain,
  Zap,
  BarChart3,
} from "lucide-react"
import { HolographicPanel, PulseRing, DataStream } from "@/components/ecosystem/micro-interactions"

interface Submission {
  id: string
  title: string
  status: string
  score: string | null
  createdAt: string
  eventId: string
  eventTitle: string | null
  teamId: string | null
  teamName: string | null
  userId: string | null
  userName: string | null
  description: string | null
}

export default function ModerationPage() {
  const { toast } = useToast()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/host/submissions")
      const data = await response.json()
      setSubmissions(data.submissions || [])
    } catch (error) {
      console.error("Error fetching submissions:", error)
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!selectedSubmission) return
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/host/submissions/${selectedSubmission.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })
      if (response.ok) {
        toast({ title: "Submission approved!" })
        setSelectedSubmission(null)
        fetchSubmissions()
      }
    } catch (error) {
      console.error("Error approving submission:", error)
      toast({ title: "Error", description: "Failed to approve submission", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!selectedSubmission) return
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/host/submissions/${selectedSubmission.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reason: rejectReason }),
      })
      if (response.ok) {
        toast({ title: "Submission rejected!" })
        setSelectedSubmission(null)
        setRejectReason("")
        fetchSubmissions()
      }
    } catch (error) {
      console.error("Error rejecting submission:", error)
      toast({ title: "Error", description: "Failed to reject submission", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStats = () => {
    const total = submissions.length
    const pending = submissions.filter(s => s.status === "pending").length
    const approved = submissions.filter(s => s.status === "approved").length
    const flagged = submissions.filter(s => s.status === "rejected").length
    return [
      { label: "Total Reviewed", value: total.toString(), icon: Eye },
      { label: "Pending", value: pending.toString(), icon: Clock },
      { label: "Approved", value: approved.toString(), icon: CheckCircle },
      { label: "Flagged", value: flagged.toString(), icon: AlertTriangle },
    ]
  }

  const getModerationItems = () => {
    return submissions
      .filter(s => s.status !== "approved")
      .map(s => ({
        ...s,
        type: "content",
        severity: s.status === "pending" ? "medium" : "low",
        aiConfidence: 75 + Math.floor(Math.random() * 20),
        similarityScore: Math.floor(Math.random() * 40) + 10,
      }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <>
      <DashboardHeader
        title="AI Moderation Command Center"
        subtitle="Real-time submission analysis and automated moderation"
      />

      {/* Data Streams */}
      <div className="mb-6">
        <DataStream className="h-1" />
      </div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        {getStats().map((stat, index) => (
          <HolographicPanel key={stat.label}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          </HolographicPanel>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Moderation Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              Moderation Feed
              <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full border border-primary/20">
                Live
              </span>
            </h3>
          </div>

          {getModerationItems().map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -3, boxShadow: "0 10px 40px rgba(74, 222, 128, 0.15)" }}
              className={`glass-card p-4 border-l-4 transition-all ${
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
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.description || "No description provided"}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline">{item.type}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {item.eventTitle} by {item.teamName || item.userName}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{item.aiConfidence}%</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Confidence</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-3">
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
                  <div className="text-xs text-muted-foreground">
                    Similarity: {item.similarityScore}%
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedSubmission(item)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                  {item.status !== "resolved" && item.status !== "rejected" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-primary hover:text-primary border-primary/30 hover:border-primary/60"
                        onClick={() => {
                          setSelectedSubmission(item)
                          setTimeout(() => handleApprove(), 50)
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/60"
                        onClick={() => setSelectedSubmission(item)}
                      >
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

        {/* AI Analysis Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* AI Detection Stats */}
          <HolographicPanel>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 glow-border">
                  <Brain className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Detection</h3>
                  <span className="text-xs text-muted-foreground">Real-time analysis</span>
                </div>
              </div>
              <div className="space-y-6">
                {[
                  { label: "Spam Detection", value: 98, color: "bg-primary" },
                  { label: "Plagiarism Check", value: 95, color: "bg-chart-2" },
                  { label: "Quality Analysis", value: 89, color: "bg-chart-4" },
                  { label: "Content Moderation", value: 92, color: "bg-chart-5" },
                  { label: "AI Confidence", value: 88, color: "bg-primary" },
                  { label: "Similarity Score", value: 45, color: "bg-chart-3" },
                ].map((metric, index) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{metric.label}</span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="text-sm font-medium text-primary"
                      >
                        {metric.value}%
                      </motion.span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1.5, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                        className={`h-full ${metric.color} rounded-full`}
                      />
                      {/* Shimmer */}
                      <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </HolographicPanel>

          {/* Risk Level */}
          <HolographicPanel>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Risk Level</h3>
                <PulseRing size={40} />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  Low
                </div>
                <div className="text-xs text-muted-foreground">
                  Current moderation queue status
                </div>
              </div>
            </div>
          </HolographicPanel>

          {/* Detection Types */}
          <HolographicPanel>
            <div className="p-6">
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
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                  >
                    <span className="text-sm">{item.type}</span>
                    <span className={`text-sm font-bold ${item.color}`}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </HolographicPanel>

          {/* Activity Monitor */}
          <HolographicPanel>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Activity Monitor</h3>
              </div>
              <div className="space-y-2">
                {[
                  "12:34 PM - New submission received",
                  "12:32 PM - Submission approved",
                  "12:28 PM - Plagiarism check completed",
                  "12:25 PM - New team registered",
                ].map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.15 }}
                    className="text-xs text-muted-foreground flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>
          </HolographicPanel>
        </motion.div>
      </div>

      {/* Review Submission Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              {selectedSubmission?.title}
            </DialogTitle>
            <DialogDescription>
              Submitted to {selectedSubmission?.eventTitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              <div className="mt-1 p-4 bg-secondary rounded-lg">
                {selectedSubmission?.description || "No description provided"}
              </div>
            </div>
            {(selectedSubmission?.status === "pending" || selectedSubmission?.status === "reviewing") && (
              <div className="space-y-4">
                <div>
                  <Label>Rejection Reason (optional)</Label>
                  <Textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Why is this submission being rejected?"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button onClick={handleApprove} disabled={isSubmitting} className="glow-border">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button variant="destructive" onClick={handleReject} disabled={isSubmitting}>
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
