import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedPage } from "@/components/layout/AnimatedPage"

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const mockEvents = [
  { id: 1, title: 'Weekly Sync', date: 15, type: 'internal' },
  { id: 2, title: 'Client Demo', date: 15, type: 'external' },
  { id: 3, title: 'Architecture Review', date: 18, type: 'internal' },
  { id: 4, title: 'Q3 Planning', date: 22, type: 'planning' },
]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Simple calendar math for the current month view
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const monthName = currentDate.toLocaleString('default', { month: 'long' })

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const renderCells = () => {
    const cells = []
    
    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="min-h-[120px] p-2 bg-muted/20 border-r border-b border-border/50" />)
    }

    // Actual days
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()
      const dayEvents = mockEvents.filter(e => e.date === d)

      cells.push(
        <div key={d} className={`min-h-[120px] p-2 border-r border-b border-border/50 transition-colors hover:bg-muted/10 ${isToday ? 'bg-primary/5' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>
              {d}
            </span>
          </div>
          <div className="space-y-1">
            {dayEvents.map(event => (
              <Badge 
                key={event.id} 
                variant="outline" 
                className={`w-full justify-start font-normal truncate cursor-pointer hover:opacity-80 transition-opacity ${
                  event.type === 'internal' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                  event.type === 'external' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                  'bg-purple-500/10 text-purple-500 border-purple-500/20'
                }`}
              >
                {event.title}
              </Badge>
            ))}
          </div>
        </div>
      )
    }

    // Fill the rest of the grid to maintain 7 columns
    const remainingCells = 42 - cells.length // 6 rows * 7 days
    for (let i = 0; i < remainingCells; i++) {
      cells.push(<div key={`end-empty-${i}`} className="min-h-[120px] p-2 bg-muted/20 border-r border-b border-border/50" />)
    }

    return cells
  }

  return (
    <AnimatedPage className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Schedule and manage your upcoming meetings.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Event
        </Button>
      </div>

      <Card className="shadow-lg border-border/50 bg-card/95 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">{monthName} {year}</h2>
            <div className="flex items-center gap-1 bg-muted rounded-md p-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2 text-xs">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-normal">Internal</Badge>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 font-normal">External</Badge>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20 font-normal">Planning</Badge>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b bg-muted/30">
          {days.map(day => (
            <div key={day} className="py-3 text-center text-sm font-medium text-muted-foreground border-r border-border/50 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 bg-background">
          {renderCells()}
        </div>
      </Card>
    </AnimatedPage>
  )
}
