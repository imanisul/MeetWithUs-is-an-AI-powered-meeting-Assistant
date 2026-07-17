import { useState } from "react"
import { UploadCloud, FileText, Trash2, Search, Loader2, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { documentsApi } from "@/services/documents.api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { AnimatedPage } from "@/components/layout/AnimatedPage"
import { useNavigate } from "react-router-dom"
import { DocumentAccessModal } from "@/components/DocumentAccessModal"
import { Shield } from "lucide-react"

export function DocumentManager() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [accessModalDoc, setAccessModalDoc] = useState(null)
  
  const { data: documentsData, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: documentsApi.getDocuments,
  })

  const documents = documentsData?.data ? documentsData.data : (Array.isArray(documentsData) ? documentsData : [])

  const uploadMutation = useMutation({
    mutationFn: documentsApi.uploadDocument,
    onSuccess: () => {
      toast.success("Document uploaded & processed successfully!")
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to upload document")
    }
  })

  const deleteMutation = useMutation({
    mutationFn: documentsApi.deleteDocument,
    onSuccess: () => {
      toast.success("Document deleted successfully")
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete document")
    }
  })
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are currently supported for RAG upload.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    uploadMutation.mutate(formData, {
      onSettled: () => {
        e.target.value = null;
      }
    })
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    navigate(`/dashboard/ai?q=${encodeURIComponent(searchQuery)}`);
  }

  const formatSize = (bytes) => {
    if (!bytes) return "Unknown";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(2) + " KB";
    return (kb / 1024).toFixed(2) + " MB";
  }

  return (
    <AnimatedPage className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Documents</h1>
          <p className="text-slate-400 mt-1">
            Manage your organization's knowledge base for AI assistance.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit shadow-md border-white/5 bg-white/[0.03] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Upload Document</CardTitle>
            <CardDescription className="text-slate-400">
              Upload meeting transcripts or notes (PDF). The AI will index them for Semantic Search.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-xl mx-6 mb-6 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
            <UploadCloud className="h-10 w-10 text-blue-400 mb-4" />
            <p className="text-sm font-medium text-white mb-1">Click to browse or drag & drop</p>
            <p className="text-xs text-slate-500 mb-4">PDF up to 10MB</p>
            <div className="relative w-full">
              <Input 
                type="file" 
                accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileUpload}
                disabled={uploadMutation.isPending}
              />
              <Button disabled={uploadMutation.isPending} className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0">
                {uploadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Select File"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md border-white/5 bg-white/[0.03] backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4 gap-4 flex-wrap">
            <div className="space-y-1">
              <CardTitle className="text-white">Knowledge Base</CardTitle>
              <CardDescription className="text-slate-400">Documents indexed in the RAG Vector Store</CardDescription>
            </div>
            <form onSubmit={handleSearch} className="relative w-full sm:w-80 flex">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask AI about decisions/meetings..." 
                className="pl-10 pr-20 h-10 bg-white/5 border-white/10 text-white rounded-lg focus-visible:ring-blue-500/50 w-full" 
              />
              <Button 
                type="submit"
                size="sm"
                className="absolute right-1 top-1 h-8 bg-blue-500 hover:bg-blue-600 text-white"
                disabled={!searchQuery.trim()}
              >
                Ask
              </Button>
            </form>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Date Uploaded</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-32 text-muted-foreground">
                      No documents uploaded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => (
                    <TableRow key={doc._id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        {doc.fileName}
                      </TableCell>
                      <TableCell>{new Date(doc.createdAt || doc.uploadedAt).toLocaleDateString()}</TableCell>
                      <TableCell>{formatSize(doc.size)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 mr-2"
                          onClick={() => setAccessModalDoc(doc)}
                          title="Manage Access"
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => deleteMutation.mutate(doc._id)}
                          disabled={deleteMutation.isPending}
                          title="Delete Document"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      {accessModalDoc && (
        <DocumentAccessModal 
          document={accessModalDoc} 
          isOpen={!!accessModalDoc} 
          setIsOpen={(open) => !open && setAccessModalDoc(null)} 
        />
      )}
    </AnimatedPage>
  )
}

