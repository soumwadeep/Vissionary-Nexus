import { MentorSidebar } from "@/components/dashboard/mentor-sidebar"

export default function MentorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <MentorSidebar />
      <main className="pl-64 transition-all duration-300">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
