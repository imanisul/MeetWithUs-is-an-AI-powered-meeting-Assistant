import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Bot, Sparkles, CheckSquare, Save, ArrowLeft, Calendar as CalendarIcon, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import axios from "axios"
import toast from "react-hot-toast"

export function MeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Using mock state for the demo if ID isn't provided or API isn't ready
  const [meeting, setMeeting] = useState({
    title: "Quarterly Planning Sync",
    date: new Date().toLocaleDateString(),
    time: "10:00 AM - 11:30 AM",
    attendees: 5,
    status: "Completed",
    notes: "Discussed Q3 goals. Marketing will launch campaign by Aug 1. Engineering needs to fix the checkout bug before the launch. Sarah will lead the marketing team sync next week. Budget approved for new hires in sales.",
    aiSummary: "",
    aiActionItems: ""
  });

  const [notes, setNotes] = useState(meeting.notes);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingActionItems, setIsGeneratingActionItems] = useState(false);

  // In a real app, you would fetch meeting by ID here
  useEffect(() => {
    // If we had a real endpoint:
    // axios.get(\`/meetings/\${id}\`).then(res => { setMeeting(res.data); setNotes(res.data.notes); })
  }, [id]);

  const handleGenerateSummary = async () => {
    if (!notes.trim()) return toast.error("Please add some meeting notes first.");
    
    setIsGeneratingSummary(true);
    const toastId = toast.loading("Generating AI Summary...");
    try {
      const res = await axios.post("http://127.0.0.1:8000/ai/generate-summary", { notes });
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
      const res = await axios.post("http://127.0.0.1:8000/ai/generate-action-items", { notes });
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
      // In a real app, PUT to /meetings/:id/ai
      // await axios.put(\`http://127.0.0.1:8000/meetings/\${id}/ai\`, { notes, summary: meeting.aiSummary, actionItems: meeting.aiActionItems })
      toast.success("Meeting updated successfully", { id: toastId });
    } catch (error) {
      toast.error("Failed to save changes", { id: toastId });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{meeting.title}</h1>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">{meeting.status}</Badge>
          </div>
          <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CalendarIcon className="h-4 w-4" /> {meeting.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {meeting.time}</span>
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {meeting.attendees} Attendees</span>
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
  )
}
