"use client"

import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Key, 
  Wallet,
  Moon,
  Sun,
  Mail,
  MessageSquare,
  Smartphone,
  Trash2,
  Download,
  LogOut
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

const settingsSections = [
  {
    title: "Notifications",
    icon: Bell,
    settings: [
      { id: "email_notifications", label: "Email Notifications", description: "Receive updates via email", enabled: true },
      { id: "push_notifications", label: "Push Notifications", description: "Receive push notifications", enabled: true },
      { id: "event_reminders", label: "Event Reminders", description: "Get reminded about upcoming events", enabled: true },
      { id: "team_messages", label: "Team Messages", description: "Notifications for team chat", enabled: false },
      { id: "leaderboard_updates", label: "Leaderboard Updates", description: "Updates when your rank changes", enabled: true },
    ],
  },
  {
    title: "Privacy",
    icon: Shield,
    settings: [
      { id: "profile_visibility", label: "Public Profile", description: "Make your profile visible to others", enabled: true },
      { id: "show_activity", label: "Show Activity", description: "Display your activity on profile", enabled: true },
      { id: "show_stats", label: "Show Statistics", description: "Display your stats publicly", enabled: false },
    ],
  },
  {
    title: "Appearance",
    icon: Palette,
    settings: [
      { id: "dark_mode", label: "Dark Mode", description: "Use dark theme", enabled: true },
      { id: "animations", label: "Animations", description: "Enable UI animations", enabled: true },
      { id: "compact_mode", label: "Compact Mode", description: "Use compact layout", enabled: false },
    ],
  },
]

export default function SettingsPage() {
  return (
    <>
      <DashboardHeader
        title="Settings"
        subtitle="Manage your account preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {settingsSections.map((section, sectionIndex) => {
            const SectionIcon = section.icon
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <SectionIcon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                </div>
                <div className="space-y-4">
                  {section.settings.map((setting, index) => (
                    <div
                      key={setting.id}
                      className={`flex items-center justify-between py-3 ${
                        index !== section.settings.length - 1 ? "border-b border-border/50" : ""
                      }`}
                    >
                      <div>
                        <p className="font-medium">{setting.label}</p>
                        <p className="text-sm text-muted-foreground">{setting.description}</p>
                      </div>
                      <Switch defaultChecked={setting.enabled} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Key className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Security</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <Input 
                  id="current_password" 
                  type="password" 
                  placeholder="Enter current password"
                  className="bg-secondary border-border" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input 
                  id="new_password" 
                  type="password" 
                  placeholder="Enter new password"
                  className="bg-secondary border-border" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input 
                  id="confirm_password" 
                  type="password" 
                  placeholder="Confirm new password"
                  className="bg-secondary border-border" 
                />
              </div>
              <Button className="mt-2">Update Password</Button>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Connected Wallet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Connected Wallet</h3>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50 border border-border mb-4">
              <p className="font-mono text-sm truncate">0x1234...5678</p>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Change Wallet
              </Button>
              <Button variant="outline" className="w-full text-destructive hover:text-destructive">
                Disconnect
              </Button>
            </div>
          </motion.div>

          {/* Language */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Language</h3>
            </div>
            <select className="w-full p-2 rounded-lg bg-secondary border border-border text-sm">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
            </select>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6 border-destructive/30"
          >
            <h3 className="font-semibold text-destructive mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" />
                Export Data
              </Button>
              <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
