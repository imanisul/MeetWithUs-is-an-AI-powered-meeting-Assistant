import { Bell, Search, Settings, User, Check, Moon, Sun, Sparkles } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

import axios from "axios"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { logout as logoutAction } from "@/store/slices/authSlice"

export function Navbar() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // Decode user info from JWT
  let userName = "User";
  let userEmail = "";
  let userInitials = "U";
  let userRole = "GUEST";
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      userEmail = decoded.email || "";
      userName = decoded.fullName || userEmail.split("@")[0] || "User";
      userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
      userRole = decoded.role || "GUEST";
    }
  } catch (e) {}

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // map backend structure to frontend structure
        const mapped = res.data.data.map(n => ({
          id: n._id,
          title: n.title,
          description: n.description,
          time: new Date(n.createdAt).toLocaleDateString(), // simplified time
          read: n.read
        }));
        setNotifications(mapped);
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };
    fetchNotifications();
    // optionally set an interval to poll
    const interval = setInterval(fetchNotifications, 30000); // every 30s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/login");
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      toast.error("Failed to mark notifications as read");
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-white/5 bg-background/80 backdrop-blur-xl px-4 shadow-sm">
      <div className="flex flex-1 items-center gap-4">
        <SidebarTrigger className="text-slate-400 hover:text-white transition-colors md:hidden" />
        
        {/* Search Bar */}
        <div className="w-full max-w-lg hidden md:flex items-center relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
          <Input
            type="search"
            placeholder="Search meetings, documents, or ask AI..."
            className="w-full h-10 bg-white/5 pl-10 border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/30 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-slate-500">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* AI Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-semibold text-emerald-400">AI Online</span>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <Bell className="h-[18px] w-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-blue-500/50">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-slate-900 border-white/10" align="end">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="font-semibold text-sm text-white">Notifications</span>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-auto p-0 text-xs text-blue-400 hover:text-blue-300 hover:bg-transparent">
                  <Check className="mr-1 h-3 w-3" /> Mark all read
                </Button>
              )}
            </div>
            <DropdownMenuSeparator className="bg-white/5" />
            <ScrollArea className="h-[280px]">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-4 flex gap-3 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-b-0 ${notification.read ? 'opacity-50' : ''}`}>
                  <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${notification.read ? 'bg-transparent' : 'bg-blue-500 shadow-lg shadow-blue-500/50'}`} />
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-medium leading-none text-white">{notification.title}</p>
                    <p className="text-xs text-slate-400 line-clamp-2">{notification.description}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{notification.time}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-xl p-0 hover:bg-white/5 transition-all">
              <Avatar className="h-8 w-8 border-2 border-blue-500/30">
                <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 bg-slate-900 border-white/10" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-blue-500/30">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1 min-w-0">
                  <p className="text-sm font-semibold leading-none text-white truncate">{userName}</p>
                  <p className="text-xs leading-none text-slate-400 truncate">{userEmail}</p>
                  <span className="inline-flex w-fit items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 mt-1">{userRole.replace("_", " ")}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="text-slate-300 focus:text-white focus:bg-white/5 cursor-pointer">
                <Link to="/dashboard/profile" className="flex w-full items-center py-2">
                  <User className="mr-3 h-4 w-4 text-slate-500" /> Profile Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-slate-300 focus:text-white focus:bg-white/5 cursor-pointer">
                <Link to="/dashboard/organization" className="flex w-full items-center py-2">
                  <Settings className="mr-3 h-4 w-4 text-slate-500" /> Workspace Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer py-2">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
