import { useState } from "react"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "axios"
import toast from "react-hot-toast"

export function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI Meeting Assistant. You can ask me anything about past meetings or uploaded documents." }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const res = await axios.get(`http://127.0.0.1:8000/ai/search`, {
        params: { query: userMessage }
      })
      
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: res.data.answer || res.data.data?.answer || "I found some information.",
        sources: res.data.sources || res.data.data?.sources
      }])
    } catch (error) {
      console.error(error)
      toast.error("Failed to get response from AI")
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error searching the documents." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions about your meetings, notes, and uploaded documents.
        </p>
      </div>

      <Card className="flex flex-col flex-1 shadow-lg border-border/50 bg-card/95 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            MeetWithUs AI
          </CardTitle>
          <CardDescription>Powered by Google Gemini & LangChain RAG</CardDescription>
        </CardHeader>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6 pb-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`flex flex-col max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div 
                    className={`rounded-2xl px-4 py-2 ${
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-tr-sm" 
                        : "bg-muted rounded-tl-sm text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg border border-border/50">
                      <p className="font-semibold mb-1">Sources Context:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        {msg.sources.map((src, i) => (
                          <li key={i} className="line-clamp-2">{src}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {msg.role === "user" && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 border">
                  <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Searching knowledge base...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background/50">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., What were the key takeaways from the Q3 Marketing Sync?"
              className="flex-1 bg-background"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
