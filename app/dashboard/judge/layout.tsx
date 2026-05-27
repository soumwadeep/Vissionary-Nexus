import { JudgeSidebar } from "@/components/dashboard/judge-sidebar"

export default function JudgeDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <JudgeSidebar />
      <main className="pl-64 transition-all duration-300">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
