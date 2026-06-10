"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ParticipantWidgets } from "@/components/dashboard/participant-widgets"
import { useAuth } from "@/hooks/use-auth"

export default function ParticipantDashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'User'

  return (
    <>
      <DashboardHeader
        title={`Welcome back, ${firstName}`}
        subtitle="Here's what's happening in your innovation journey"
      />
      <ParticipantWidgets />
    </>
  )
}
