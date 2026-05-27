"use client"

import { motion, AnimatePresence } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Send, Sparkles, Code, Lightbulb, BookOpen, Bug, Cpu, Zap, Activity } from "lucide-react"
import { useState, useRef, useEffect } from "react"

const suggestedPrompts = [
  { icon: Lightbulb, text: "Help me brainstorm project ideas for the AI hackathon" },
  { icon: Code, text: "Review my React component architecture" },
  { icon: BookOpen, text: "Suggest learning resources for machine learning" },
  { icon: Bug, text: "Help me debug this API integration issue" },
]

const thinkingPhrases = [
  "Analyzing your request...",
  "Processing context...",
  "Generating response...",
  "Optimizing suggestions...",
  "Finalizing recommendations...",
]

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your AI Mentor, here to guide you through your innovation journey. I can help with project ideas, code reviews, learning resources, debugging, and more. How can I assist you today?",
  },
]

export default function AIMentorPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [thinkingPhrase, setThinkingPhrase] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiActivity, setAiActivity] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, displayedText])

  // Thinking phrase rotation
  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setThinkingPhrase((prev) => (prev + 1) % thinkingPhrases.length)
      }, 1200)
      return () => clearInterval(interval)
    }
  }, [isTyping])

  // AI activity pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setAiActivity(true)
      setTimeout(() => setAiActivity(false), 500)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      role: "user" as const,
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI thinking and response
    setTimeout(() => {
      setIsTyping(false)
      setIsGenerating(true)

      const responses = [
        "That's a great question! Based on your current skills and the upcoming hackathons, I'd recommend focusing on a project that combines your React expertise with AI. Consider building an intelligent dashboard that uses natural language processing to generate insights from data.",
        "I've analyzed your codebase and here are some suggestions: 1) Consider implementing proper error boundaries in your React components, 2) Your state management could benefit from using React Query for server state, 3) Add proper TypeScript types to improve code maintainability.",
        "For machine learning, I recommend starting with these resources: 1) Fast.ai's practical deep learning course, 2) The 'Hands-On Machine Learning' book by Aurélien Géron, 3) Kaggle competitions for practical experience. Would you like me to create a personalized learning roadmap?",
        "Looking at your API integration, the issue might be related to CORS headers or authentication token handling. Try checking if your backend properly sets the Access-Control-Allow-Origin header. Also, ensure you're refreshing tokens before they expire.",
      ]

      const fullResponse = responses[Math.floor(Math.random() * responses.length)]

      // Typewriter effect
      let currentIndex = 0
      const typeInterval = setInterval(() => {
        if (currentIndex <= fullResponse.length) {
          setDisplayedText(fullResponse.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(typeInterval)
          setIsGenerating(false)
          setDisplayedText("")

          const aiMessage = {
            id: messages.length + 2,
            role: "assistant" as const,
            content: fullResponse,
          }
          setMessages((prev) => [...prev, aiMessage])
        }
      }, 20)
    }, 2500)
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <>
      <DashboardHeader
        title="AI Mentor"
        subtitle="Your personal AI guide for innovation and learning"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Suggested Prompts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 lg:col-span-1 relative overflow-hidden"
        >
          {/* AI thinking animation */}
          <motion.div
            animate={{
              opacity: aiActivity ? [0.2, 0.5, 0.2] : 0.1,
              scale: aiActivity ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 1 }}
            className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl"
          />

          <div className="flex items-center gap-2 mb-4 relative">
            <motion.div
              animate={{ rotate: aiActivity ? 360 : 0 }}
              transition={{ duration: 1 }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
            <h3 className="font-semibold">Quick Prompts</h3>
          </div>

          <div className="space-y-3 relative">
            {suggestedPrompts.map((prompt, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handlePromptClick(prompt.text)}
                whileHover={{ x: 5, backgroundColor: "rgba(74, 222, 128, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="mt-0.5"
                  >
                    <prompt.icon className="w-4 h-4 text-primary" />
                  </motion.div>
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {prompt.text}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* AI Capabilities */}
          <div className="mt-6 pt-6 border-t border-border relative">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              AI Capabilities
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Project guidance",
                "Code review & debugging",
                "Learning recommendations",
                "Hackathon strategies",
                "Team collaboration tips",
              ].map((cap, i) => (
                <motion.li
                  key={cap}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                  />
                  {cap}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* AI Status */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">AI Status</span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-primary">Online</span>
              </div>
            </div>
            <motion.div
              className="mt-2 h-1 bg-secondary rounded-full overflow-hidden"
            >
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card flex flex-col lg:col-span-3 overflow-hidden"
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center gap-3">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 10px rgba(74, 222, 128, 0.3)",
                  "0 0 20px rgba(74, 222, 128, 0.5)",
                  "0 0 10px rgba(74, 222, 128, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-2 rounded-lg bg-primary/10 border border-primary/20"
            >
              <Brain className="w-6 h-6 text-primary" />
            </motion.div>
            <div className="flex-1">
              <h3 className="font-semibold">Nexus AI Mentor</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Always available
              </div>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="w-4 h-4 text-primary/50" />
            </motion.div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary border border-border rounded-bl-sm"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Brain className="w-4 h-4 text-primary" />
                      </motion.div>
                      <span className="text-xs font-medium text-primary">AI Mentor</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </motion.div>
              </motion.div>
            ))}

            {/* Generating response with typewriter */}
            <AnimatePresence>
              {isGenerating && displayedText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[80%] p-4 bg-secondary border border-border rounded-2xl rounded-bl-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Brain className="w-4 h-4 text-primary" />
                      </motion.div>
                      <span className="text-xs font-medium text-primary">AI Mentor</span>
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-xs text-primary/50"
                      >
                        typing...
                      </motion.span>
                    </div>
                    <p className="text-sm leading-relaxed">
                      {displayedText}
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
                      />
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Thinking indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex justify-start"
                >
                  <div className="bg-secondary border border-border rounded-2xl rounded-bl-sm p-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="p-1 rounded bg-primary/10"
                      >
                        <Brain className="w-4 h-4 text-primary" />
                      </motion.div>
                      <div>
                        <div className="flex gap-1 mb-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                              className="w-2 h-2 bg-primary rounded-full"
                            />
                          ))}
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={thinkingPhrase}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-xs text-muted-foreground"
                          >
                            {thinkingPhrases[thinkingPhrase]}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="Ask your AI mentor anything..."
                  className="h-12 bg-secondary border-border pr-12"
                />
                <motion.div
                  animate={input ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: input ? Infinity : 0 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Zap className={`w-4 h-4 ${input ? "text-primary" : "text-muted-foreground/30"}`} />
                </motion.div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping || isGenerating}
                  className="h-12 px-6 glow-border"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
