import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/services/api"
import toast from "react-hot-toast"
import { MeetingCreateDialog } from "@/components/meetings/MeetingCreateDialog"
import { AnimatedPage } from "@/components/layout/AnimatedPage"

export function MeetingList() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    try {
      const res = await api.get(`/meetings`);
      setMeetings(res.data.data);
    } catch (err) {
      toast.error("Failed to load meetings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Meetings</h1>
          <p className="text-slate-400">
            Manage your organization's meetings.
          </p>
        </div>
        <MeetingCreateDialog onMeetingCreated={fetchMeetings} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Meetings</CardTitle>
          <CardDescription>A list of all recent and upcoming meetings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : meetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">No meetings found.</TableCell>
                </TableRow>
              ) : (
                meetings.map((meeting) => (
                  <TableRow key={meeting._id}>
                    <TableCell className="font-medium">{meeting.title}</TableCell>
                    <TableCell>{new Date(meeting.startTime).toLocaleDateString()}</TableCell>
                    <TableCell>{meeting.attendees?.length || 0} participants</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => window.location.href = `/dashboard/meetings/${meeting._id}`}>View</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    </AnimatedPage>
  )
}
