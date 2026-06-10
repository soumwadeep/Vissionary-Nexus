"use client"

import { motion, AnimatePresence } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Plus, Clock, CheckCircle, Circle, MoreVertical, Sparkles, Loader2, X, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

const columns = [
  { id: "pending", title: "Pending", icon: Circle, color: "text-muted-foreground" },
  { id: "inProgress", title: "In Progress", icon: Clock, color: "text-chart-4" },
  { id: "completed", title: "Completed", icon: CheckCircle, color: "text-primary" },
]

interface Task {
  id?: string | number
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  estimatedTime?: string
  category?: string
  aiSuggested?: boolean
  status?: "pending" | "inProgress" | "completed"
}

export default function TasksPage() {
  const { session, status: sessionStatus } = useAuth()
  const [tasks, setTasks] = useState({ pending: [], inProgress: [], completed: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<Task[]>([])
  const [selectedSuggestions, setSelectedSuggestions] = useState<number[]>([])

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks()
  }, [session?.user?.id])

  const fetchTasks = async () => {
    if (sessionStatus !== 'authenticated') return
    setIsLoading(true)
    try {
      const response = await fetch('/api/tasks')
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks)
      }
    } catch (e) {
      console.error('Failed to fetch tasks:', e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewSuggestions = async () => {
    setSuggestionsOpen(true)
    setIsGenerating(true)
    try {
      const userProfile = session?.user ? {
        role: session.user.role || 'member',
        skills: ['React', 'TypeScript', 'Problem Solving'],
        interests: [],
        reputation: 0
      } : null

      const response = await fetch('/api/ai/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          userId: session?.user?.id, // Now passing userId
          projectContext: {}
        })
      })
      const data = await response.json()
      setAiSuggestions(data.tasks.map((t: any) => ({ ...t, aiSuggested: true })))
    } catch (e) {
      console.error('Failed to get suggestions:', e)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveSuggestions = async () => {
    if (sessionStatus !== 'authenticated') {
      console.error("❌ Not authenticated!")
      return
    }
    if (selectedSuggestions.length === 0) {
      console.error("❌ No tasks selected!")
      return
    }
    
    try {
      const tasksToSave = selectedSuggestions.map(i => aiSuggestions[i])
      
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'save',
          tasks: tasksToSave
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ API response not ok:", errorText)
        return
      }
      
      const data = await response.json()
      
      setSuggestionsOpen(false)
      setSelectedSuggestions([])
      fetchTasks() // Refresh tasks
    } catch (e) {
      console.error("❌ Failed to save tasks:", e)
    }
  }

  const handleMoveTask = async (taskId: string | number, newStatus: string) => {
    if (!session?.user?.id) return
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'move',
          taskId,
          status: newStatus
        })
      })
      fetchTasks() // Refresh
    } catch (e) {
      console.error('Failed to move task:', e)
    }
  }

  return (
    <>
      <DashboardHeader
        title="Tasks"
        subtitle="Manage your hackathon tasks with AI assistance"
      />

      {/* AI Task Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">AI Task Suggestions</h3>
              <p className="text-sm text-muted-foreground">
                Based on your profile and hackathon goals
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleViewSuggestions}>
            View Suggestions
          </Button>
        </div>
      </motion.div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column, colIndex) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIndex * 0.1 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <column.icon className={`w-5 h-5 ${column.color}`} />
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {tasks[column.id as keyof typeof tasks].length}
                </Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                tasks[column.id as keyof typeof tasks].map((task: any, index: number) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: colIndex * 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <CheckSquare className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{task.title}</p>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <Badge
                              variant={
                                task.priority === "high"
                                  ? "destructive"
                                  : task.priority === "medium"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                            {task.estimated_time && (
                              <span className="text-xs text-muted-foreground">
                                {task.estimated_time}
                              </span>
                            )}
                            {task.ai_suggested && (
                              <Sparkles className="w-3 h-3 text-primary" />
                            )}
                          </div>
                          {column.id === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 h-6 text-xs"
                              onClick={() => handleMoveTask(task.id, "inProgress")}
                            >
                              Start
                            </Button>
                          )}
                          {column.id === "inProgress" && (
                            <div className="flex gap-1 mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs"
                                onClick={() => handleMoveTask(task.id, "pending")}
                              >
                                Back
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs"
                                onClick={() => handleMoveTask(task.id, "completed")}
                              >
                                Complete
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {!isLoading && tasks[column.id as keyof typeof tasks].length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No tasks yet
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Suggestions Dialog */}
      <Dialog open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Task Suggestions
            </DialogTitle>
            <DialogDescription>
              Select tasks to add to your board
            </DialogDescription>
          </DialogHeader>

          {isGenerating ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Generating personalized tasks...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-4">
              {aiSuggestions.map((task, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setSelectedSuggestions(prev => 
                      prev.includes(index) 
                        ? prev.filter(i => i !== index)
                        : [...prev, index]
                    )
                  }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedSuggestions.includes(index)
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary/50 hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge
                          variant={
                            task.priority === "high"
                              ? "destructive"
                              : task.priority === "medium"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                        {task.category && (
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {task.description}
                        </p>
                      )}
                      {task.estimatedTime && (
                        <span className="text-xs text-muted-foreground">
                          Est: {task.estimatedTime}
                        </span>
                      )}
                    </div>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      selectedSuggestions.includes(index) ? 'bg-primary border-primary' : 'border-border'
                    }`}>
                      {selectedSuggestions.includes(index) && (
                        <CheckCircle className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSuggestionsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSuggestions}
              disabled={isGenerating || selectedSuggestions.length === 0}
            >
              <Save className="w-4 h-4 mr-2" />
              Save {selectedSuggestions.length} Task{selectedSuggestions.length !== 1 ? 's' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
