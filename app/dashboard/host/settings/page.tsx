"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import {
  Settings,
  Bell,
  Shield,
  Save,
} from "lucide-react"

const settingsSections = [
  {
    id: "profile",
    title: "Host Profile",
    icon: Settings,
    fields: [
      { name: "organizationName", label: "Organization Name", type: "text", placeholder: "Enter organization name" },
      { name: "organizationDescription", label: "Description", type: "textarea", placeholder: "Tell participants about your organization" },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    fields: [],
    toggles: [
      { name: "emailNotifications", label: "Email Notifications" },
      { name: "pushNotifications", label: "Push Notifications" },
      { name: "weeklyDigest", label: "Weekly Digest" },
    ],
  },
  {
    id: "security",
    title: "Security",
    icon: Shield,
    fields: [],
    toggles: [
      { name: "twoFactorEnabled", label: "Two-Factor Authentication" },
    ],
  },
]

interface HostSettings {
  organizationName: string
  organizationDescription: string
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
  twoFactorEnabled: boolean
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<HostSettings>({
    organizationName: "",
    organizationDescription: "",
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    twoFactorEnabled: false,
  })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/host/settings")
        const data = await response.json()
        setSettings(data)
      } catch (error) {
        console.error("Error fetching settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/host/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast({
          title: "Settings saved!",
          description: "Your settings have been saved successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to save settings.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
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
        title="Settings"
        subtitle="Manage your profile and security preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {settingsSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <section.icon className="w-5 h-5 text-chart-2" />
                <h3 className="font-semibold">{section.title}</h3>
              </div>
              
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.name}
                        placeholder={field.placeholder}
                        className="h-24 bg-secondary border-border"
                        value={settings[field.name as keyof HostSettings] as string}
                        onChange={(e) => setSettings({ ...settings, [field.name]: e.target.value })}
                      />
                    ) : (
                      <Input
                        id={field.name}
                        placeholder={field.placeholder}
                        className="h-12 bg-secondary border-border"
                        value={settings[field.name as keyof HostSettings] as string}
                        onChange={(e) => setSettings({ ...settings, [field.name]: e.target.value })}
                      />
                    )}
                  </div>
                ))}

                {section.toggles?.map((toggle) => (
                  <div key={toggle.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                    <Label htmlFor={toggle.name}>{toggle.label}</Label>
                    <Switch
                      id={toggle.name}
                      checked={settings[toggle.name as keyof HostSettings] as boolean}
                      onCheckedChange={(checked) => setSettings({ ...settings, [toggle.name]: checked })}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="glass-card p-6 sticky top-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full glow-border"
              >
                {saving ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </span>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
