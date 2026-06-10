"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  BarChart3,
  Award,
  Settings,
  LogOut,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/mentor" },
  { icon: Users, label: "My Teams", href: "/dashboard/mentor/teams" },
  { icon: Calendar, label: "Sessions", href: "/dashboard/mentor/sessions" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/mentor/messages" },
  { icon: BarChart3, label: "Progress", href: "/dashboard/mentor/progress" },
  { icon: Award, label: "Reputation", href: "/dashboard/mentor/reputation" },
  { icon: Settings, label: "Settings", href: "/dashboard/mentor/settings" },
]

export function MentorSidebar() {
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
        <div className="p-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-3">
            <img src="/apple-icon.png" alt="Vissionary Nexus" className="w-14 h-14 rounded-xl shrink-0" />
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <span className="font-bold text-lg">Nexus</span>
                <span className="text-xs text-purple-400 block">Mentor Portal</span>
              </motion.div>
            )}
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-purple-400 border border-purple-400/30"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-purple-400")} />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button variant="ghost" onClick={logout} className={cn("w-full justify-start text-sidebar-foreground/70 hover:text-destructive", collapsed && "justify-center")}>
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="w-full">
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </motion.aside>
  )
}
