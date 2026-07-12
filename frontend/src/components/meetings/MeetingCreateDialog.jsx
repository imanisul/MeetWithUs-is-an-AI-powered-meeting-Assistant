import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Video, Plus } from "lucide-react"
import api from "@/services/api"
import toast from "react-hot-toast"

export function MeetingCreateDialog({ onMeetingCreated, className }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    attendees: "",
    useGoogleMeet: true
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const toastId = toast.loading("Creating meeting...")

    try {
      const token = localStorage.getItem("token")
      const payload = {
        ...formData,
        attendees: formData.attendees.split(",").map(email => email.trim()).filter(e => e)
      }

      await api.post(`/meetings`, payload)

      toast.success("Meeting created successfully!", { id: toastId })
      setOpen(false)
      if (onMeetingCreated) onMeetingCreated()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create meeting", { id: toastId })
    } finally {
      setIsLoading(false)
    }
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
            <label className="text-sm font-medium text-slate-300">Attendees (Comma separated emails)</label>
            <Input 
              placeholder="john@example.com, sarah@example.com"
              value={formData.attendees}
              onChange={e => setFormData({...formData, attendees: e.target.value})}
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
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

          <DialogFooter className="pt-4 border-t border-white/10">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-white/5 hover:text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? "Creating..." : "Schedule Meeting"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
