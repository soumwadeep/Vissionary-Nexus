"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Trophy,
  Filter,
  Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

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
}

export default function SubmissionsPage() {
  const { toast } = useToast()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [submissionDetail, setSubmissionDetail] = useState<any>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchSubmissions()
  }, [search, statusFilter])

  const fetchSubmissions = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      
      const response = await fetch(`/api/host/submissions?${params.toString()}`)
      const data = await response.json()
      setSubmissions(data.submissions || [])
    } catch (error) {
      console.error("Error fetching submissions:", error)
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (submission: Submission) => {
    setSelectedSubmission(submission)
    try {
      const response = await fetch(`/api/host/submissions/${submission.id}`)
      const data = await response.json()
      setSubmissionDetail(data)
    } catch (error) {
      console.error("Error fetching submission details:", error)
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
    const reviewed = submissions.filter(s => s.status === "reviewed" || s.status === "approved").length
    const rejected = submissions.filter(s => s.status === "rejected").length
    return [
      { label: "Total Submissions", value: total.toString(), icon: FileText },
      { label: "Pending Review", value: pending.toString(), icon: Trophy },
      { label: "Reviewed", value: reviewed.toString(), icon: CheckCircle },
      { label: "Rejected", value: rejected.toString(), icon: XCircle },
    ]
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
        title="Submissions"
        subtitle="Review and score all event submissions"
      />

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        {getStats().map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <stat.icon className="w-5 h-5 text-chart-2 mb-2" />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-6 flex flex-wrap gap-4 items-center"
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            className="h-12 bg-secondary border-border pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={!statusFilter ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter(null)}
          >
            All
          </Button>
          <Button 
            variant={statusFilter === "pending" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </Button>
          <Button 
            variant={statusFilter === "approved" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("approved")}
          >
            Approved
          </Button>
          <Button 
            variant={statusFilter === "rejected" ? "default" : "outline"} 
            size="sm"
            onClick={() => setStatusFilter("rejected")}
          >
            Rejected
          </Button>
        </div>
      </motion.div>

      {/* Submissions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {submissions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No submissions found</p>
          </div>
        ) : (
          submissions.map((submission, index) => (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{submission.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>by {submission.teamName || submission.userName || "Unknown"}</span>
                    <span>•</span>
                    <span>{submission.eventTitle || "Unknown Event"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {submission.score && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{submission.score}</div>
                      <div className="text-xs text-muted-foreground">Score</div>
                    </div>
                  )}
                  <Badge
                    variant={
                      submission.status === "pending"
                        ? "outline"
                        : submission.status === "approved" || submission.status === "reviewed"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {submission.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleView(submission)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {submission.status === "pending" && (
                      <>
                        <Button variant="outline" size="sm" className="text-primary hover:text-primary" onClick={() => handleView(submission)}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleView(submission)}>
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* View Submission Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSubmission?.title}</DialogTitle>
            <DialogDescription>
              Submitted to {selectedSubmission?.eventTitle}
            </DialogDescription>
          </DialogHeader>
          {submissionDetail && (
            <div className="space-y-4">
              <div>
                <Label>Description</Label>
                <div className="mt-1 p-4 bg-secondary rounded-lg">
                  {submissionDetail.submission.description || "No description provided"}
                </div>
              </div>
              {submissionDetail.submission.submissionUrl && (
                <div>
                  <Label>Submission URL</Label>
                  <a
                    href={submissionDetail.submission.submissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-primary hover:underline"
                  >
                    {submissionDetail.submission.submissionUrl}
                  </a>
                </div>
              )}
              {selectedSubmission?.status === "pending" && (
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
                    <Button onClick={handleApprove} disabled={isSubmitting}>
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
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
