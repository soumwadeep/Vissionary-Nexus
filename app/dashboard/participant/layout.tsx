import { ParticipantSidebar } from "@/components/dashboard/participant-sidebar"

export default function ParticipantDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <ParticipantSidebar />
      <main className="pl-64 transition-all duration-300">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
