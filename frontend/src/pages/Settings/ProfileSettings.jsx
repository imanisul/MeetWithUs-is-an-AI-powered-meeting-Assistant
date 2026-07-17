import { useState, useEffect } from "react"
import { User, Mail, Shield, Save, Camera, Key, Bell } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { jwtDecode } from "jwt-decode"
import toast from "react-hot-toast"
import { AnimatedPage } from "@/components/layout/AnimatedPage"
import api from "@/services/api"

export function ProfileSettings() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        const user = res.data.data;
        setProfile({
          fullName: user.fullName || "User",
          email: user.email,
          role: user.role
        });
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Saving profile...");
    try {
      await api.put('/users/me', { fullName: profile.fullName });
      toast.success("Profile updated successfully", { id: toastId });
    } catch (e) {
      toast.error("Failed to update profile", { id: toastId });
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const userInitials = profile.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const roleColors = {
    'SUPER_ADMIN': 'from-red-500 to-orange-500 text-white',
    'ORG_ADMIN': 'from-blue-500 to-indigo-500 text-white',
    'MEMBER': 'from-emerald-500 to-green-500 text-white',
    'GUEST': 'from-slate-500 to-slate-600 text-white',
  };

  return (
    <AnimatedPage className="space-y-8 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile Settings</h1>
        <p className="text-slate-400 mt-1">
          Manage your personal account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 border-white/5 bg-white/[0.03] backdrop-blur-sm h-fit overflow-hidden">
          {/* Background gradient header */}
          <div className="h-24 bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-purple-500/30 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
          
          <CardContent className="flex flex-col items-center text-center space-y-4 -mt-12 relative">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-xl text-white">{profile.fullName}</h3>
              <p className="text-sm text-slate-400">{profile.email}</p>
            </div>
            <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r ${roleColors[profile.role] || roleColors.GUEST}`}>
              <Shield className="h-3.5 w-3.5" />
              <span>{profile.role?.replace("_", " ")}</span>
            </div>

            <div className="w-full pt-4 space-y-3">
              <div className="flex justify-between text-sm py-2 border-t border-white/5">
                <span className="text-slate-500">Meetings</span>
                <span className="text-white font-semibold">24</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-t border-white/5">
                <span className="text-slate-500">AI Summaries</span>
                <span className="text-white font-semibold">12</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-t border-white/5">
                <span className="text-slate-500">Joined</span>
                <span className="text-white font-semibold">Jul 2026</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Info */}
          <Card className="border-white/5 bg-white/[0.03] backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                  <User className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-base">Personal Information</CardTitle>
                  <CardDescription className="text-slate-500 text-xs">Update your personal details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <form onSubmit={handleSave}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input 
                      className="pl-10 h-11 bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-blue-500/50" 
                      value={profile.fullName}
                      onChange={(e) => setProfile(p => ({ ...p, fullName: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input 
                      className="pl-10 h-11 bg-white/5 border-white/10 text-slate-400 rounded-xl opacity-60 cursor-not-allowed" 
                      value={profile.email} 
                      disabled 
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">Email cannot be changed for security reasons.</p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-white/5 bg-white/[0.02] px-6 py-4">
                <Button type="submit" disabled={isSaving} className="ml-auto gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-10 px-6">
                  <Save className="h-4 w-4" /> 
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Security */}
          <Card className="border-white/5 bg-white/[0.03] backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
                  <Key className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-base">Security</CardTitle>
                  <CardDescription className="text-slate-500 text-xs">Manage your password and security settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Current Password</label>
                <Input 
                  type="password"
                  placeholder="Enter current password"
                  className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-blue-500/50" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">New Password</label>
                <Input 
                  type="password"
                  placeholder="Enter new password"
                  className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus-visible:ring-blue-500/50" 
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 bg-white/[0.02] px-6 py-4">
              <Button variant="outline" className="ml-auto gap-2 border-white/10 text-slate-300 hover:text-white rounded-xl h-10 px-6">
                <Key className="h-4 w-4" /> Update Password
              </Button>
            </CardFooter>
          </Card>

          {/* Preferences */}
          <Card className="border-white/5 bg-white/[0.03] backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
                  <Bell className="h-4 w-4 text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-white text-base">Notifications</CardTitle>
                  <CardDescription className="text-slate-500 text-xs">Configure how you receive updates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Email notifications for meeting invites", enabled: true },
                { label: "AI summary completion alerts", enabled: true },
                { label: "Weekly analytics digest", enabled: false },
              ].map((pref, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-sm text-slate-300">{pref.label}</span>
                  <button className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${pref.enabled ? 'bg-blue-500' : 'bg-white/10'}`}>
                    <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform mt-1 ${pref.enabled ? 'translate-x-6 ml-0' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  )
}
