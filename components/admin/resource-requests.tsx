"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ResourceRequest } from "@/lib/types"
import { Check, X, Clock, User, FileText, Calendar } from "lucide-react"

interface ResourceRequestWithDetails {
  id: string
  user_id: string
  resource_id: string
  status: 'pending' | 'approved' | 'denied'
  expires_at?: string
  admin_notes?: string
  created_at: string
  updated_at: string
  user: {
    email: string
  }
  resource: {
    title: string
    visibility: string
  }
}

export function ResourceRequestsManager() {
  const [requests, setRequests] = useState<ResourceRequestWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<ResourceRequestWithDetails | null>(null)
  const [adminNotes, setAdminNotes] = useState("")
  const [expirationDays, setExpirationDays] = useState(7)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const supabase = createClient()
      
      // First try to get requests with the view
      let data, error
      
      try {
        const result = await supabase
          .from("resource_requests_with_details")
          .select("*")
          .order("created_at", { ascending: false })
        data = result.data
        error = result.error
      } catch (viewError) {
        console.log("View not found, trying direct table query")
        
        // Fallback to direct table query
        const result = await supabase
          .from("resource_requests")
          .select("*")
          .order("created_at", { ascending: false })
        data = result.data
        error = result.error
      }

      if (error) throw error
      
      // Transform data to match expected format
      const transformedData = (data || []).map(request => ({
        id: request.id,
        user_id: request.user_id,
        resource_id: request.resource_id,
        status: request.status,
        expires_at: request.expires_at,
        admin_notes: request.admin_notes,
        created_at: request.created_at,
        updated_at: request.updated_at,
        user: { 
          email: request.user_email || "Loading...",
          name: request.user_name || "Loading..."
        },
        resource: { 
          title: request.resource_title || "Loading...", 
          visibility: request.resource_visibility || "protected" 
        }
      }))
      
      setRequests(transformedData)
    } catch (error) {
      console.error("Error fetching requests:", error)
      setRequests([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (requestId: string, status: 'approved' | 'denied') => {
    try {
      const supabase = createClient()
      
      let updateData: any = { status }
      
      if (status === 'approved') {
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + expirationDays)
        updateData.expires_at = expiresAt.toISOString()
      }
      
      if (adminNotes) {
        updateData.admin_notes = adminNotes
      }

      const { error } = await supabase
        .from("resource_requests")
        .update(updateData)
        .eq("id", requestId)

      if (error) throw error

      await fetchRequests()
      setSelectedRequest(null)
      setAdminNotes("")
    } catch (error) {
      console.error("Error updating request:", error)
      alert("Error updating request")
    }
  }

  const getStatusBadge = (status: string, expiresAt?: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'approved':
        const isExpired = expiresAt && new Date(expiresAt) < new Date()
        return (
          <Badge variant={isExpired ? "destructive" : "default"}>
            <Check className="h-3 w-3 mr-1" />
            {isExpired ? "Expired" : "Approved"}
          </Badge>
        )
      case 'denied':
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Denied</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return <div>Loading requests...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resource Access Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-muted-foreground">No requests found.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{request.user?.email}</span>
                        {getStatusBadge(request.status, request.expires_at)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Requesting access to: <strong>{request.resource?.title}</strong>
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                        {request.expires_at && (
                          <span>
                            Expires: {new Date(request.expires_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedRequest(request)
                          }}
                        >
                          Review
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Review Modal */}
      {selectedRequest && (
        <Card>
          <CardHeader>
            <CardTitle>Review Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>User</Label>
              <p className="text-sm">{selectedRequest.user?.email}</p>
            </div>
            
            <div className="space-y-2">
              <Label>Resource</Label>
              <p className="text-sm font-medium">{selectedRequest.resource?.title}</p>
            </div>

            <div className="space-y-2">
              <Label>Request Date</Label>
              <p className="text-sm">{new Date(selectedRequest.created_at).toLocaleString()}</p>
            </div>

            {selectedRequest.status === 'pending' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="expirationDays">Access Duration (days)</Label>
                  <Input
                    id="expirationDays"
                    type="number"
                    min="1"
                    max="365"
                    value={expirationDays}
                    onChange={(e) => setExpirationDays(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminNotes">Admin Notes (optional)</Label>
                  <Textarea
                    id="adminNotes"
                    placeholder="Add notes about this approval/denial..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => updateRequestStatus(selectedRequest.id, 'approved')}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => updateRequestStatus(selectedRequest.id, 'denied')}
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Deny
                  </Button>
                </div>
              </>
            )}

            {selectedRequest.admin_notes && (
              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <p className="text-sm bg-muted p-2 rounded">{selectedRequest.admin_notes}</p>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => {
                setSelectedRequest(null)
                setAdminNotes("")
              }}
            >
              Close
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
