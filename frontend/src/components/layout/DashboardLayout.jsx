import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Navbar } from "./Navbar"
import { Outlet, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"

export function DashboardLayout() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Navbar />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
        <Toaster position="top-right" />
      </div>
    </SidebarProvider>
  )
}
