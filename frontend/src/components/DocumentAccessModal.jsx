import { useState, useEffect } from "react"
import { Shield, UserPlus, Trash2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { documentsApi } from "@/services/documents.api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"

export function DocumentAccessModal({ document, isOpen, setIsOpen }) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("USER")
  const queryClient = useQueryClient()

  const addAccessMutation = useMutation({
    mutationFn: (data) => documentsApi.addDocumentAccess(document._id, data),
    onSuccess: () => {
      toast.success("Access granted successfully")
      setEmail("")
      setRole("USER")
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to grant access")
    }
  })

  const removeAccessMutation = useMutation({
    mutationFn: (emailToRemove) => documentsApi.removeDocumentAccess(document._id, emailToRemove),
    onSuccess: () => {
      toast.success("Access removed successfully")
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove access")
    }
  })

  const handleAddAccess = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    addAccessMutation.mutate({ email, role })
  }

  const accessList = document?.accessList || []

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Manage Access
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Control who can view and ask the AI about '{document?.fileName}'.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddAccess} className="flex gap-2 items-center my-4">
          <Input 
            placeholder="User email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-slate-900 border-slate-700"
            disabled={addAccessMutation.isPending}
            required
            type="email"
          />
          <Select value={role} onValueChange={setRole} disabled={addAccessMutation.isPending}>
            <SelectTrigger className="w-[110px] bg-slate-900 border-slate-700">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="CO_ADMIN">Co-Admin</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={addAccessMutation.isPending || !email} className="bg-blue-600 hover:bg-blue-700">
            {addAccessMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          </Button>
        </form>

        <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto pr-2">
          <h4 className="text-sm font-medium text-slate-400">Current Access List</h4>
          {accessList.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4 border border-dashed border-slate-800 rounded-lg">
              No specific users added. Only the uploader can view this document.
            </p>
          ) : (
            accessList.map((access, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/50">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{access.email}</span>
                  <span className="text-xs text-slate-400">{access.role}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={() => removeAccessMutation.mutate(access.email)}
                  disabled={removeAccessMutation.isPending}
                >
                  {removeAccessMutation.isPending && removeAccessMutation.variables === access.email ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
