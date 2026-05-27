import { HostSidebar } from "@/components/dashboard/host-sidebar"

export default function HostDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <HostSidebar />
      <main className="pl-64 transition-all duration-300">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
