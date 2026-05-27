"use client"

import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Plus, Clock, CheckCircle, Circle, MoreVertical, Sparkles } from "lucide-react"
import { useState } from "react"

const initialTasks = {
  pending: [
    {
      id: 1,
      title: "Set up project repository",
      priority: "high",
      dueDate: "Dec 15",
      aiSuggested: true,
    },
    {
      id: 2,
      title: "Design database schema",
      priority: "medium",
      dueDate: "Dec 16",
      aiSuggested: false,
    },
  ],
  inProgress: [
    {
      id: 3,
      title: "Implement authentication flow",
      priority: "high",
      dueDate: "Dec 14",
      aiSuggested: false,
    },
    {
      id: 4,
      title: "Create API endpoints",
      priority: "medium",
      dueDate: "Dec 15",
      aiSuggested: true,
    },
  ],
  completed: [
    {
      id: 5,
      title: "Project ideation",
      priority: "low",
      dueDate: "Dec 10",
      aiSuggested: false,
    },
    {
      id: 6,
      title: "Team formation",
      priority: "high",
      dueDate: "Dec 11",
      aiSuggested: true,
    },
  ],
}

const columns = [
  { id: "pending", title: "Pending", icon: Circle, color: "text-muted-foreground" },
  { id: "inProgress", title: "In Progress", icon: Clock, color: "text-chart-4" },
  { id: "completed", title: "Completed", icon: CheckCircle, color: "text-primary" },
]

export default function TasksPage() {
  const [tasks] = useState(initialTasks)

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
                Based on your hackathon timeline, consider adding these tasks
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
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
              {tasks[column.id as keyof typeof tasks].map((task, index) => (
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
                        <div className="flex items-center gap-2 mt-2">
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
                          <span className="text-xs text-muted-foreground">
                            {task.dueDate}
                          </span>
                          {task.aiSuggested && (
                            <Sparkles className="w-3 h-3 text-primary" />
                          )}
                        </div>
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
              ))}
            </div>

            {tasks[column.id as keyof typeof tasks].length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No tasks yet
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </>
  )
}
