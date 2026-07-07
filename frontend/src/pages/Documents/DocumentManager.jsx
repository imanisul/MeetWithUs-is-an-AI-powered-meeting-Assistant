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
import axios from "axios"
import toast from "react-hot-toast"

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
      const token = localStorage.getItem("token");
      const res = await axios.post("http://127.0.0.1:8000/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage your organization's knowledge base for AI assistance.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 h-fit shadow-md border-border/50 bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>
              Upload meeting transcripts or notes (PDF). The AI will index them for Semantic Search.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border/50 rounded-lg mx-6 mb-6 bg-muted/20 hover:bg-muted/40 transition-colors">
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-1">Click to browse or drag & drop</p>
            <p className="text-xs text-muted-foreground mb-4">PDF up to 10MB</p>
            <div className="relative">
              <Input 
                type="file" 
                accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <Button disabled={isUploading} variant="outline" className="w-full">
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Select File"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Knowledge Base</CardTitle>
              <CardDescription>Documents indexed in the RAG Vector Store</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search files..." className="pl-8" />
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
    </div>
  )
}
