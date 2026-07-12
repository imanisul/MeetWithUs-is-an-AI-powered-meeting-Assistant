import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Bot, Sparkles, CheckSquare, Save, ArrowLeft, Calendar as CalendarIcon, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import api from "@/services/api"
import toast from "react-hot-toast"
import { AnimatedPage } from "@/components/layout/AnimatedPage"

export function MeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Using mock state for the demo if ID isn't provided or API isn't ready
  const [meeting, setMeeting] = useState({
    title: "Loading...",
    date: "",
    time: "",
    attendees: [],
    status: "",
    notes: "",
    aiSummary: "",
    aiActionItems: "",
    meetingLink: ""
  });

  const [notes, setNotes] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingActionItems, setIsGeneratingActionItems] = useState(false);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await api.get(`/meetings/${id}`);
        const m = res.data.data;
        if (!m) {
          toast.error("Meeting not found");
          return;
        }
        setMeeting({
          title: m.title || "Untitled Meeting",
          date: m.startTime ? new Date(m.startTime).toLocaleDateString() : "No Date",
          time: m.startTime ? new Date(m.startTime).toLocaleTimeString() : "No Time",
          attendees: m.attendees || [],
          status: m.status || "Scheduled",
          notes: m.notes || "",
          aiSummary: m.aiSummary || "",
          aiActionItems: m.aiActionItems || "",
          meetingLink: m.meetingLink || "",
          agenda: m.agenda || ""
        });
        setNotes(m.notes || "");
      } catch (error) {
        toast.error("Failed to load meeting details");
      }
    };
    if (id) fetchMeeting();
  }, [id]);

  const handleGenerateSummary = async () => {
    if (!notes.trim()) return toast.error("Please add some meeting notes first.");
    
    setIsGeneratingSummary(true);
    const toastId = toast.loading("Generating AI Summary...");
    try {
      const res = await api.post(`/ai/generate-summary`, { notes });
      setMeeting(prev => ({ ...prev, aiSummary: res.data.data }));
      toast.success("Summary generated!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate summary", { id: toastId });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleGenerateActionItems = async () => {
    if (!notes.trim()) return toast.error("Please add some meeting notes first.");
    
    setIsGeneratingActionItems(true);
    const toastId = toast.loading("Extracting Action Items...");
    try {
      const res = await api.post(`/ai/generate-action-items`, { notes });
      setMeeting(prev => ({ ...prev, aiActionItems: res.data.data }));
      toast.success("Action items extracted!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to extract action items", { id: toastId });
    } finally {
      setIsGeneratingActionItems(false);
    }
  };

  const handleSave = async () => {
    const toastId = toast.loading("Saving changes...");
    try {
      await api.put(`/meetings/${id}/ai`, { 
        notes, 
        summary: meeting.aiSummary, 
        actionItems: meeting.aiActionItems 
      });
      toast.success("Meeting updated successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to save changes", { id: toastId });
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        <div className="flex items-center gap-4">
        <Button variant="ghost" className="gap-2 text-slate-400 hover:text-white" onClick={() => navigate("/dashboard/meetings")}>
          <ArrowLeft className="h-4 w-4" /> Back to Meetings
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{meeting.title}</h1>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">{meeting.status}</Badge>
          </div>
          <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CalendarIcon className="h-4 w-4" /> {meeting.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {meeting.time}</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {meeting.attendees?.length || 0} Attendees</span>
          </div>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Raw Notes */}
        <Card className="flex flex-col shadow-md border-border/50">
          <CardHeader className="bg-muted/30 border-b">
            <CardTitle>Meeting Transcript / Notes</CardTitle>
            <CardDescription>Paste your raw meeting notes here for the AI to process.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <Textarea 
              className="min-h-[500px] rounded-none border-0 focus-visible:ring-0 resize-none p-6 text-base"
              placeholder="Start typing meeting notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Right Column: AI Generations */}
        <div className="space-y-6">
          <Card className="shadow-md border-border/50 bg-card/95 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-purple-500/5 border-b border-purple-500/10 flex flex-row items-center justify-between py-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-purple-500">
                  <Bot className="h-5 w-5" /> AI Generated Agenda
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {meeting.agenda ? (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {meeting.agenda}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground/50 text-sm">
                  <Bot className="h-8 w-8 mb-2 opacity-50" />
                  <p>No agenda was generated for this meeting.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md border-border/50 bg-card/95 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between py-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" /> Executive Summary
                </CardTitle>
              </div>
              <Button size="sm" variant="secondary" onClick={handleGenerateSummary} disabled={isGeneratingSummary}>
                {isGeneratingSummary ? "Generating..." : "Generate AI Summary"}
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {meeting.aiSummary ? (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {meeting.aiSummary}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground/50 text-sm">
                  <Bot className="h-8 w-8 mb-2 opacity-50" />
                  <p>No summary generated yet.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md border-border/50 bg-card/95 backdrop-blur-sm overflow-hidden">
            <CardHeader className="bg-blue-500/5 border-b border-blue-500/10 flex flex-row items-center justify-between py-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-blue-500">
                  <CheckSquare className="h-5 w-5" /> Action Items
                </CardTitle>
              </div>
              <Button size="sm" variant="secondary" onClick={handleGenerateActionItems} disabled={isGeneratingActionItems}>
                {isGeneratingActionItems ? "Extracting..." : "Extract Action Items"}
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {meeting.aiActionItems ? (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-muted-foreground">
                  {meeting.aiActionItems}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-muted-foreground/50 text-sm">
                  <CheckSquare className="h-8 w-8 mb-2 opacity-50" />
                  <p>No action items extracted yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </AnimatedPage>
  )
}
