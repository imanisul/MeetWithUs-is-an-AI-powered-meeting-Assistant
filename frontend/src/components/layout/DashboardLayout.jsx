import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Navbar } from "./Navbar"
import { Outlet, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import { useEffect } from "react"
import { useSelector } from "react-redux"

export function DashboardLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Force dark mode globally to preserve the premium aesthetic and fix text visibility
    document.documentElement.classList.add('dark');
  }, []);

  if (!isAuthenticated) {
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
