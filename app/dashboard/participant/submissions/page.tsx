"use client"

import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, Clock, CheckCircle, AlertCircle, Eye, Download, Plus, X, ExternalLink, Github, Globe, Link } from "lucide-react"
import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { analyticsEvents } from "@/lib/analytics"

const initialSubmissions = [
  {
    id: 1,
    title: "AI-Powered Healthcare Assistant",
    event: "AI Innovation Hackathon 2024",
    status: "submitted",
    submittedAt: "Dec 14, 2024 at 11:45 PM",
    score: null,
    feedback: null,
    description: "An AI-powered assistant that helps healthcare professionals with patient diagnosis and treatment recommendations using machine learning models.",
    repoUrl: "https://github.com/user/healthcare-ai",
    demoUrl: "https://healthcare-ai-demo.vercel.app",
    techStack: ["React", "Python", "TensorFlow", "FastAPI"],
  },
  {
    id: 2,
    title: "DeFi Portfolio Optimizer",
    event: "Web3 DeFi Challenge",
    status: "draft",
    submittedAt: null,
    score: null,
    feedback: null,
    description: "A decentralized finance portfolio optimizer that uses AI to suggest optimal asset allocation across multiple DeFi protocols.",
    repoUrl: "https://github.com/user/defi-optimizer",
    demoUrl: null,
    techStack: ["Next.js", "Solidity", "Ethers.js", "Hardhat"],
  },
  {
    id: 3,
    title: "Carbon Footprint Tracker",
    event: "Climate Tech Buildathon",
    status: "reviewed",
    submittedAt: "Nov 12, 2024 at 5:30 PM",
    score: 85,
    feedback: "Great implementation of AI features. Could improve UX.",
    description: "A mobile-first web app that tracks and gamifies reducing your carbon footprint through daily activities and challenges.",
    repoUrl: "https://github.com/user/carbon-tracker",
    demoUrl: "https://carbon-tracker.vercel.app",
    techStack: ["React Native", "Node.js", "MongoDB", "Chart.js"],
  },
  {
    id: 4,
    title: "Medical Diagnosis AI",
    event: "Healthcare AI Summit",
    status: "reviewed",
    submittedAt: "Nov 11, 2024 at 4:00 PM",
    score: 92,
    feedback: "Excellent work! Innovative approach to medical diagnostics.",
    description: "An advanced medical diagnosis system using computer vision and deep learning to analyze medical images and provide preliminary diagnoses.",
    repoUrl: "https://github.com/user/medical-ai",
    demoUrl: "https://medical-ai-demo.vercel.app",
    techStack: ["Python", "PyTorch", "OpenCV", "Streamlit"],
  },
]

const statusConfig = {
  draft: { label: "Draft", icon: FileText, color: "text-muted-foreground", variant: "secondary" as const },
  submitted: { label: "Submitted", icon: Clock, color: "text-chart-4", variant: "default" as const },
  reviewed: { label: "Reviewed", icon: CheckCircle, color: "text-primary", variant: "outline" as const },
}

const availableEvents = [
  { id: "ai-hackathon-2024", name: "AI Innovation Hackathon 2024" },
  { id: "web3-defi", name: "Web3 DeFi Challenge" },
  { id: "climate-tech", name: "Climate Tech Buildathon" },
  { id: "healthcare-ai", name: "Healthcare AI Summit" },
]

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false)
  const [newSubmissionDialogOpen, setNewSubmissionDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedSubmission, setSelectedSubmission] = useState<typeof initialSubmissions[0] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExporting, setIsExporting] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const [newSubmission, setNewSubmission] = useState({
    title: "",
    event: "",
    description: "",
    repoUrl: "",
    demoUrl: "",
    techStack: "",
  })

  const handleCreateSubmission = async () => {
    if (!newSubmission.title || !newSubmission.event) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the title and event fields.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const submission = {
      id: submissions.length + 1,
      title: newSubmission.title,
      event: availableEvents.find(e => e.id === newSubmission.event)?.name || newSubmission.event,
      status: "draft",
      submittedAt: null,
      score: null,
      feedback: null,
      description: newSubmission.description || "No description provided.",
      repoUrl: newSubmission.repoUrl || null,
      demoUrl: newSubmission.demoUrl || null,
      techStack: newSubmission.techStack.split(",").map(t => t.trim()).filter(Boolean),
    }

    setSubmissions(prev => [submission as typeof initialSubmissions[0], ...prev])
    setIsCreating(false)
    setNewSubmissionDialogOpen(false)
    setNewSubmission({ title: "", event: "", description: "", repoUrl: "", demoUrl: "", techStack: "" })
    
    toast({
      title: "Submission Created",
      description: `"${submission.title}" has been created as a draft.`,
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setUploadedFiles(prev => [...prev, ...Array.from(files)])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUploadSubmit = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsCreating(false)
    setUploadDialogOpen(false)
    setUploadedFiles([])
    
    toast({
      title: "Files Uploaded",
      description: `${uploadedFiles.length} file(s) uploaded successfully. They will be attached to your next submission.`,
    })
  }

  const handleView = (submission: typeof initialSubmissions[0]) => {
    setSelectedSubmission(submission)
    setViewDialogOpen(true)
  }

  const handleSubmit = (submission: typeof initialSubmissions[0]) => {
    setSelectedSubmission(submission)
    setSubmitDialogOpen(true)
  }

  const confirmSubmit = async () => {
    if (!selectedSubmission) return
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Track analytics event
    const eventId = availableEvents.find(e => e.name === selectedSubmission.event)?.id
    analyticsEvents.submissionCreated(selectedSubmission.title, eventId)
    
    setSubmissions(prev => prev.map(sub => 
      sub.id === selectedSubmission.id 
        ? { ...sub, status: "submitted", submittedAt: new Date().toLocaleString() }
        : sub
    ))
    
    setIsSubmitting(false)
    setSubmitDialogOpen(false)
    toast({
      title: "Submission Successful",
      description: `"${selectedSubmission.title}" has been submitted for review.`,
    })
  }

  const handleExport = async (submission: typeof initialSubmissions[0]) => {
    setIsExporting(submission.id)
    // Simulate export generation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Create a mock export file
    const exportData = {
      title: submission.title,
      event: submission.event,
      status: submission.status,
      submittedAt: submission.submittedAt,
      score: submission.score,
      feedback: submission.feedback,
      description: submission.description,
      repoUrl: submission.repoUrl,
      demoUrl: submission.demoUrl,
      techStack: submission.techStack,
      exportedAt: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${submission.title.toLowerCase().replace(/\s+/g, "-")}-submission.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setIsExporting(null)
    toast({
      title: "Export Complete",
      description: `"${submission.title}" has been exported successfully.`,
    })
  }

  return (
    <>
      <DashboardHeader
        title="Submissions"
        subtitle="Manage your hackathon project submissions"
      />

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4 mb-6"
      >
        <Button className="gap-2" onClick={() => setNewSubmissionDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          New Submission
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setUploadDialogOpen(true)}>
          <Upload className="w-4 h-4" />
          Upload Files
        </Button>
      </motion.div>

      {/* Submissions List */}
      <div className="space-y-4">
        {submissions.map((submission, index) => {
          const config = statusConfig[submission.status as keyof typeof statusConfig]
          const StatusIcon = config.icon
          
          return (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{submission.title}</h3>
                    <Badge variant={config.variant} className="gap-1">
                      <StatusIcon className={`w-3 h-3 ${config.color}`} />
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{submission.event}</p>
                  {submission.submittedAt && (
                    <p className="text-xs text-muted-foreground">
                      Submitted: {submission.submittedAt}
                    </p>
                  )}
                  {submission.feedback && (
                    <div className="mt-3 p-3 rounded-lg bg-secondary/50 border border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Feedback:</span>{" "}
                        {submission.feedback}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {submission.score !== null && (
                    <div className="text-center">
                      <span className="text-xs text-muted-foreground block">Score</span>
                      <span className="text-2xl font-bold text-primary">{submission.score}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => handleView(submission)}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    {submission.status === "draft" && (
                      <Button 
                        size="sm" 
                        className="gap-1"
                        onClick={() => handleSubmit(submission)}
                      >
                        <Upload className="w-4 h-4" />
                        Submit
                      </Button>
                    )}
                    {submission.status !== "draft" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        disabled={isExporting === submission.id}
                        onClick={() => handleExport(submission)}
                      >
                        <Download className="w-4 h-4" />
                        {isExporting === submission.id ? "Exporting..." : "Export"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {submissions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
          <p className="text-muted-foreground mb-4">
            Start by creating a new submission for an active hackathon
          </p>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Submission
          </Button>
        </motion.div>
      )}

      {/* View Submission Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              {selectedSubmission?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedSubmission?.event}
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Badge variant={statusConfig[selectedSubmission.status as keyof typeof statusConfig].variant}>
                  {statusConfig[selectedSubmission.status as keyof typeof statusConfig].label}
                </Badge>
                {selectedSubmission.score !== null && (
                  <Badge variant="outline" className="gap-1">
                    Score: <span className="text-primary font-bold">{selectedSubmission.score}</span>
                  </Badge>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{selectedSubmission.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSubmission.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary">{tech}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Links</h4>
                <div className="flex flex-col gap-2">
                  {selectedSubmission.repoUrl && (
                    <a 
                      href={selectedSubmission.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      {selectedSubmission.repoUrl}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {selectedSubmission.demoUrl && (
                    <a 
                      href={selectedSubmission.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Globe className="w-4 h-4" />
                      {selectedSubmission.demoUrl}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
              
              {selectedSubmission.feedback && (
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <h4 className="text-sm font-medium mb-1">Judge Feedback</h4>
                  <p className="text-sm text-muted-foreground">{selectedSubmission.feedback}</p>
                </div>
              )}
              
              {selectedSubmission.submittedAt && (
                <p className="text-xs text-muted-foreground">
                  Submitted: {selectedSubmission.submittedAt}
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Confirmation Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Submit Project
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this project? Once submitted, you cannot make further changes.
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="py-4">
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <h4 className="font-medium">{selectedSubmission.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{selectedSubmission.event}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedSubmission.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmSubmit} 
              disabled={isSubmitting}
              className="glow-border"
            >
              {isSubmitting ? "Submitting..." : "Confirm Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Submission Dialog */}
      <Dialog open={newSubmissionDialogOpen} onOpenChange={setNewSubmissionDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              New Submission
            </DialogTitle>
            <DialogDescription>
              Create a new project submission for a hackathon event.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="Enter your project title"
                value={newSubmission.title}
                onChange={(e) => setNewSubmission(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event">Event *</Label>
              <Select
                value={newSubmission.event}
                onValueChange={(value) => setNewSubmission(prev => ({ ...prev, event: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an event" />
                </SelectTrigger>
                <SelectContent>
                  {availableEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project..."
                rows={3}
                value={newSubmission.description}
                onChange={(e) => setNewSubmission(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repoUrl">GitHub Repository URL</Label>
              <Input
                id="repoUrl"
                placeholder="https://github.com/username/repo"
                value={newSubmission.repoUrl}
                onChange={(e) => setNewSubmission(prev => ({ ...prev, repoUrl: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demoUrl">Demo URL</Label>
              <Input
                id="demoUrl"
                placeholder="https://your-demo.vercel.app"
                value={newSubmission.demoUrl}
                onChange={(e) => setNewSubmission(prev => ({ ...prev, demoUrl: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="techStack">Tech Stack (comma-separated)</Label>
              <Input
                id="techStack"
                placeholder="React, Node.js, MongoDB"
                value={newSubmission.techStack}
                onChange={(e) => setNewSubmission(prev => ({ ...prev, techStack: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewSubmissionDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSubmission} 
              disabled={isCreating}
              className="glow-border"
            >
              {isCreating ? "Creating..." : "Create Submission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Files Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              Upload Files
            </DialogTitle>
            <DialogDescription>
              Upload project files, documentation, or assets for your submission.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, ZIP, images, or documents (max 50MB each)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.zip,.png,.jpg,.jpeg,.doc,.docx,.md,.txt"
              />
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files ({uploadedFiles.length})</Label>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg bg-secondary/50 border border-border"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm truncate">{file.name}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setUploadDialogOpen(false)
              setUploadedFiles([])
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleUploadSubmit} 
              disabled={isCreating || uploadedFiles.length === 0}
              className="glow-border"
            >
              {isCreating ? "Uploading..." : `Upload ${uploadedFiles.length > 0 ? `(${uploadedFiles.length})` : ""}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
