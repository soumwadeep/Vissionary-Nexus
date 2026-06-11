"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Calendar,
  Users,
  CheckSquare,
  FileText,
  Trophy,
  Brain,
  Award,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CalendarPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/participant" },
  { icon: Calendar, label: "Events", href: "/dashboard/participant/events" },
  { icon: CalendarPlus, label: "Create Event", href: "/dashboard/host/events/create" },
  { icon: Users, label: "AI Team Match", href: "/dashboard/participant/team-match" },
  { icon: CheckSquare, label: "Tasks", href: "/dashboard/participant/tasks" },
  { icon: FileText, label: "Submissions", href: "/dashboard/participant/submissions" },
  { icon: Trophy, label: "Leaderboard", href: "/dashboard/participant/leaderboard" },
  { icon: Brain, label: "AI Mentor", href: "/dashboard/participant/ai-mentor" },
  { icon: Brain, label: "Nexus Agent", href: "/dashboard/participant/nexus-agent" },
  { icon: Award, label: "NFT Badges", href: "/dashboard/participant/badges" },
  { icon: User, label: "Profile", href: "/dashboard/participant/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/participant/settings" },
]

export function ParticipantSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { logout } = useAuth()

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border">
          <Link href="/dashboard/participant" className="flex items-center gap-3">
            <img src="/apple-icon.png" alt="Vissionary Nexus" className="w-14 h-14 rounded-xl glow-border shrink-0" />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-lg"
              >
                Nexus
              </motion.span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary border border-primary/30 glow-border"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
            variant="ghost"
            onClick={logout}
            className={cn(
              "w-full justify-start text-sidebar-foreground/70 hover:text-destructive",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </motion.aside>
  )
}
