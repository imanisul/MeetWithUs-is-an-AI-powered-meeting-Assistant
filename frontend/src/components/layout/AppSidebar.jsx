import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Home, Calendar, Users, FileText, Bot, BarChart2, Settings, Building, Sparkles, LogOut, User } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { jwtDecode } from "jwt-decode"

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'MEMBER', 'GUEST'] },
  { title: "Meetings", url: "/dashboard/meetings", icon: Users, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'MEMBER', 'GUEST'] },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'MEMBER', 'GUEST'] },
  { title: "Documents", url: "/dashboard/documents", icon: FileText, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'MEMBER'] },
]

const aiItems = [
  { title: "AI Assistant", url: "/dashboard/ai", icon: Bot, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'MEMBER'] },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart2, roles: ['SUPER_ADMIN', 'ORG_ADMIN', 'MEMBER'] },
]

const adminItems = [
  { title: "Organization", url: "/dashboard/organization", icon: Building, roles: ['SUPER_ADMIN', 'ORG_ADMIN'] },
  { title: "Settings", url: "/dashboard/settings", icon: Settings, roles: ['SUPER_ADMIN', 'ORG_ADMIN'] },
]

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  let userRole = "GUEST";
  let userName = "User";
  let userEmail = "";
  let userInitials = "U";
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role || "GUEST";
      userEmail = decoded.email || "";
      userName = decoded.fullName || userEmail.split("@")[0] || "User";
      userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    } catch (e) {}
  }

  const filterByRole = (items) => items.filter(item => item.roles.includes(userRole));

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (url) => location.pathname === url || (url !== '/dashboard' && location.pathname.startsWith(url));

  return (
    <Sidebar>
      <SidebarHeader className="p-5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white">MeetWithUs</span>
            <p className="text-[10px] font-medium text-blue-400 tracking-widest uppercase">AI Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2 pt-2">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-1">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filterByRole(mainItems).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} className="h-10 rounded-lg">
                    <Link to={item.url} className="flex items-center gap-3 px-3">
                      <item.icon className="h-[18px] w-[18px]" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AI & Intelligence */}
        {filterByRole(aiItems).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-1">Intelligence</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterByRole(aiItems).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} className="h-10 rounded-lg">
                      <Link to={item.url} className="flex items-center gap-3 px-3">
                        <item.icon className="h-[18px] w-[18px]" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Admin */}
        {filterByRole(adminItems).length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 mb-1">Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filterByRole(adminItems).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)} className="h-10 rounded-lg">
                      <Link to={item.url} className="flex items-center gap-3 px-3">
                        <item.icon className="h-[18px] w-[18px]" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 mb-2">
          <Avatar className="h-9 w-9 border-2 border-blue-500/30">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/dashboard/profile" className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs font-medium text-slate-300">
            <User className="h-3.5 w-3.5" /> Profile
          </Link>
          <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 transition-colors text-xs font-medium text-slate-300">
            <LogOut className="h-3.5 w-3.5" /> Logout
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
