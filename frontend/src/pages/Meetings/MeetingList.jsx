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
import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { meetingsApi } from "@/services/meetings.api"
import { MeetingCreateDialog } from "@/components/meetings/MeetingCreateDialog"
import { AnimatedPage } from "@/components/layout/AnimatedPage"

export function MeetingList() {
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: meetingsApi.getMeetings,
  })

  const meetings = data?.data ? data.data : (Array.isArray(data) ? data : [])

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
        <MeetingCreateDialog />
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
              {isLoading ? (
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
                      <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/meetings/${meeting._id}`)}>View</Button>
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
