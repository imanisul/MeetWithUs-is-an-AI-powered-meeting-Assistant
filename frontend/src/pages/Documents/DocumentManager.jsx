import { useState } from "react"
import { UploadCloud, FileText, Trash2, Search, Loader2 } from "lucide-react"
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
import { Separator } from "@/components/ui/separator"
import api from "@/services/api"
import toast from "react-hot-toast"
import { AnimatedPage } from "@/components/layout/AnimatedPage"

export function DocumentManager() {
  const [documents, setDocuments] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  
  // Basic mock fetch for visual UI right now since there isn't a GET /documents endpoint yet
  // Usually this would call an API
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are currently supported for RAG upload.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading and embedding document...");

    const formData = new FormData();
    formData.append("document", file);

    try {
      const res = await api.post(`/documents/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      toast.success("Document uploaded & processed successfully!", { id: toastId });
      
      // Update local state to show the new doc
      setDocuments(prev => [{
        _id: res.data.document?._id || Date.now().toString(),
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        size: (file.size / 1024).toFixed(2) + " KB"
      }, ...prev]);

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload document", { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = null; // Reset input
    }
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
                disabled={isUploading}
              />
              <Button disabled={isUploading} className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0">
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Select File"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md border-white/5 bg-white/[0.03] backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
              <CardTitle className="text-white">Knowledge Base</CardTitle>
              <CardDescription className="text-slate-400">Documents indexed in the RAG Vector Store</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input placeholder="Search files..." className="pl-10 h-10 bg-white/5 border-white/10 text-white rounded-lg focus-visible:ring-blue-500/50" />
            </div>
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
                {documents.length === 0 ? (
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
                      <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                      <TableCell>{doc.size}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
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
    </AnimatedPage>
  )
}
