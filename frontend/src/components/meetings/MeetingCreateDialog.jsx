import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Video, Plus, Users as UsersIcon, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { meetingsApi } from "@/services/meetings.api"
import { usersApi } from "@/services/users.api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export function MeetingCreateDialog({ onMeetingCreated, className }) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    attendees: [], 
    useGoogleMeet: true,
    meetingLink: ""
  })

  // Fetch users when dialog opens
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAllUsers,
    enabled: open,
  })
  const availableUsers = usersData?.data ? usersData.data : (Array.isArray(usersData) ? usersData : [])

  const toggleAttendee = (email) => {
    setFormData(prev => {
      const current = prev.attendees;
      if (current.includes(email)) {
        return { ...prev, attendees: current.filter(e => e !== email) };
      } else {
        return { ...prev, attendees: [...current, email] };
      }
    });
  };

  const createMeetingMutation = useMutation({
    mutationFn: meetingsApi.createMeeting,
    onSuccess: () => {
      toast.success("Meeting created successfully!")
      setOpen(false)
      setFormData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        attendees: [],
        useGoogleMeet: true,
        meetingLink: ""
      })
      queryClient.invalidateQueries({ queryKey: ['meetings'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      if (onMeetingCreated) onMeetingCreated()
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create meeting")
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createMeetingMutation.mutate(formData)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`bg-blue-600 hover:bg-blue-700 text-white ${className || ''}`}>
          <Plus className="mr-2 h-4 w-4" /> Add Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Schedule Meeting</DialogTitle>
          <DialogDescription className="text-slate-400">
            Create a new meeting. AI will automatically generate an agenda.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Meeting Title</label>
            <Input 
              required
              placeholder="e.g. Q3 Product Roadmap Sync"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="bg-white/5 border-white/10"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Description / Goal</label>
            <Textarea 
              placeholder="What is this meeting about?"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="bg-white/5 border-white/10 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Start Time</label>
              <Input 
                type="datetime-local"
                required
                value={formData.startTime}
                onChange={e => setFormData({...formData, startTime: e.target.value})}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">End Time</label>
              <Input 
                type="datetime-local"
                required
                value={formData.endTime}
                onChange={e => setFormData({...formData, endTime: e.target.value})}
                className="bg-white/5 border-white/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Attendees</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-slate-300 h-auto min-h-10 py-2">
                  <div className="flex flex-wrap gap-1 items-center">
                    {formData.attendees.length > 0 ? (
                      formData.attendees.map(email => (
                        <Badge key={email} variant="secondary" className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                          {email.split('@')[0]}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-slate-500">Select attendees...</span>
                    )}
                  </div>
                  <UsersIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[460px] bg-slate-900 border-white/10" align="start">
                <div className="max-h-[200px] overflow-y-auto">
                  {availableUsers.map((user) => (
                    <DropdownMenuCheckboxItem
                      key={user._id}
                      checked={formData.attendees.includes(user.email)}
                      onCheckedChange={() => toggleAttendee(user.email)}
                      className="text-slate-300 focus:text-white focus:bg-white/5"
                    >
                      <div className="flex flex-col">
                        <span>{user.fullName}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </DropdownMenuCheckboxItem>
                  ))}
                  {availableUsers.length === 0 && (
                    <div className="p-2 text-sm text-slate-500 text-center">No users found in database</div>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-col gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-md">
                  <Video className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-100">Google Meet Integration</p>
                  <p className="text-xs text-blue-300/70">Generate a Google Meet link</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setFormData({...formData, useGoogleMeet: !formData.useGoogleMeet})}
                className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${formData.useGoogleMeet ? 'bg-blue-500' : 'bg-white/20'}`}
              >
                <span className={`inline-block h-3 w-3 rounded-full bg-white transition-transform mt-1 ${formData.useGoogleMeet ? 'translate-x-5 ml-0' : 'translate-x-1'}`} />
              </button>
            </div>
            {!formData.useGoogleMeet && (
              <div className="mt-2 space-y-2">
                <label className="text-sm font-medium text-slate-300">Custom Meeting Link</label>
                <Input 
                  placeholder="https://zoom.us/j/123456789"
                  value={formData.meetingLink}
                  onChange={e => setFormData({...formData, meetingLink: e.target.value})}
                  className="bg-slate-900 border-white/10 text-white"
                />
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-white/5 hover:text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={createMeetingMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
              {createMeetingMutation.isPending ? "Creating..." : "Schedule Meeting"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
