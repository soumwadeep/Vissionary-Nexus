import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ParticipantWidgets } from "@/components/dashboard/participant-widgets"

export default function ParticipantDashboard() {
  return (
    <>
      <DashboardHeader
        title="Welcome back, Alex"
        subtitle="Here's what's happening in your innovation journey"
      />
      <ParticipantWidgets />
    </>
  )
}
