"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, UserCheck, UserX, Loader2, Download } from "lucide-react"

interface User {
  id: string
  email: string
  name: string
  role: string
  created_at: string
  last_sign_in_at?: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const supabase = createClient()
      
      // Get users from public.users table instead of auth.admin
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (usersError) {
        throw usersError
      }

      // Format users data
      const formattedUsers = (usersData || []).map(user => ({
        id: user.id,
        email: user.email || '',
        name: user.name || 'No name',
        role: user.role || 'user',
        created_at: user.created_at,
        last_sign_in_at: null // We don't have this in public.users
      }))

      setUsers(formattedUsers)
    } catch (err: any) {
      console.error("Error fetching users:", err)
      setError(err.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    setUpdating(userId)
    
    try {
      const supabase = createClient()
      
      // Update user role in public.users table
      const { error } = await supabase
        .from('users')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (error) {
        throw error
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, role: newRole }
          : user
      ))

      alert(`User role updated to ${newRole}`)
    } catch (err: any) {
      console.error("Error updating user role:", err)
      alert(`Failed to update user role: ${err.message}`)
    } finally {
      setUpdating(null)
    }
  }

  const exportUsers = () => {
    if (users.length === 0) {
      alert("No users to export")
      return
    }

    const headers = ["ID", "Email", "Name", "Role", "Created At", "Last Sign In"]
    const rows = users.map(user => [
      user.id,
      user.email,
      user.name,
      user.role,
      new Date(user.created_at).toLocaleString(),
      user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "Never"
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(field => `"${field}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.setAttribute("download", "users_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="min-h-screen py-24 md:py-32" style={{ backgroundColor: '#FCF7F7' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#0D0A53' }} />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-24 md:py-32" style={{ backgroundColor: '#FCF7F7' }}>
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchUsers} style={{ backgroundColor: '#0D0A53' }}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-24 md:py-32" style={{ backgroundColor: '#FCF7F7' }}>
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#0D0A53' }}>
            User Management
          </h1>
          <p className="text-gray-600">Manage user accounts and roles</p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" style={{ color: '#0D0A53' }} />
              Users ({users.length})
            </CardTitle>
            <Button 
              onClick={exportUsers}
              variant="outline"
              className="border-2"
              style={{ borderColor: '#0D0A53', color: '#0D0A53' }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardHeader>
          
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No users found</p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Last Sign In</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>
                            <Badge 
                              className={user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {user.last_sign_in_at 
                              ? new Date(user.last_sign_in_at).toLocaleDateString()
                              : "Never"
                            }
                          </TableCell>
                          <TableCell>
                            <Select
                              value={user.role}
                              onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                              disabled={updating === user.id}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">
                                  <div className="flex items-center gap-2">
                                    <UserX className="h-4 w-4" />
                                    User
                                  </div>
                                </SelectItem>
                                <SelectItem value="admin">
                                  <div className="flex items-center gap-2">
                                    <UserCheck className="h-4 w-4" />
                                    Admin
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            {updating === user.id && (
                              <Loader2 className="h-4 w-4 animate-spin ml-2" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {users.map((user) => (
                    <Card key={user.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{user.email}</h3>
                            <p className="text-xs text-gray-600 truncate">{user.name}</p>
                          </div>
                          <Badge 
                            className={user.role === 'admin' ? 'bg-green-100 text-green-800 text-xs' : 'bg-blue-100 text-blue-800 text-xs'}
                          >
                            {user.role}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div>
                            <span className="font-medium">Created:</span>
                            <br />
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Last Sign In:</span>
                            <br />
                            {user.last_sign_in_at 
                              ? new Date(user.last_sign_in_at).toLocaleDateString()
                              : "Never"
                            }
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t">
                          <Select
                            value={user.role}
                            onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                            disabled={updating === user.id}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">
                                <div className="flex items-center gap-2">
                                  <UserX className="h-4 w-4" />
                                  User
                                </div>
                              </SelectItem>
                              <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                  <UserCheck className="h-4 w-4" />
                                  Admin
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {updating === user.id && (
                            <div className="flex items-center justify-center mt-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: '#FCF7F7', border: '1px solid #0D0A53' }}>
          <h3 className="font-semibold mb-2" style={{ color: '#0D0A53' }}>
            Role Permissions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>User Role:</strong>
              <ul className="list-disc list-inside mt-1 text-gray-600">
                <li>Can view public resources</li>
                <li>Can request access to protected resources</li>
                <li>Can register for events</li>
              </ul>
            </div>
            <div>
              <strong>Admin Role:</strong>
              <ul className="list-disc list-inside mt-1 text-gray-600">
                <li>Full access to admin panel</li>
                <li>Can manage all content (blogs, events, resources)</li>
                <li>Can manage users and roles</li>
                <li>Bypass all access restrictions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}