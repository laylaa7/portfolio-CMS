"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { generateSignedUrl, requestResourceAccess, getResourceAccessStatus } from "@/lib/resource-requests"
import type { Resource, ResourceRequest } from "@/lib/types"
import { 
  FileText, 
  ExternalLink, 
  Download, 
  Lock, 
  Unlock, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  User
} from "lucide-react"

interface ResourceCardProps {
  resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const { user, isAdmin } = useAuth()
  const [requestStatus, setRequestStatus] = useState<ResourceRequest | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (user && resource.visibility === 'protected') {
      checkRequestStatus()
    }
  }, [resource.id, user])

  const checkRequestStatus = async () => {
    try {
      const status = await getResourceAccessStatus(resource.id)
      setRequestStatus(status)
    } catch (error) {
      console.error("Error checking request status:", error)
    }
  }

  const handleRequestAccess = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/admin/login'
      return
    }

    setLoading(true)
    try {
      await requestResourceAccess(resource.id)
      await checkRequestStatus()
      alert("Access request submitted! You'll be notified when approved.")
    } catch (error: any) {
      alert(error.message || "Error requesting access")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (resource.visibility === 'public') {
      // Direct download for public resources
      if (resource.type === 'file' && resource.file_url) {
        window.open(resource.file_url, '_blank')
      } else {
        window.open(resource.link, '_blank')
      }
      return
    }

    // Protected resource - generate signed URL
    setDownloading(true)
    try {
      const { signedUrl, fileName } = await generateSignedUrl(resource.id)
      
      // Create a temporary link and trigger download
      const link = document.createElement('a')
      link.href = signedUrl
      link.download = fileName || 'download'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error: any) {
      alert(error.message || "Error downloading file")
    } finally {
      setDownloading(false)
    }
  }

  const getVisibilityIcon = () => {
    if (resource.visibility === 'public') {
      return <Unlock className="h-4 w-4 text-green-600" />
    }
    return <Lock className="h-4 w-4 text-orange-600" />
  }

  const getVisibilityBadge = () => {
    if (resource.visibility === 'public') {
      return <Badge variant="default" className="bg-green-100 text-green-800"><Unlock className="h-3 w-3 mr-1" />Public</Badge>
    }
    return <Badge variant="secondary" className="bg-orange-100 text-orange-800"><Lock className="h-3 w-3 mr-1" />Protected</Badge>
  }

  const getActionButton = () => {
    // Admin bypass - show direct download/edit options
    if (isAdmin) {
      return (
        <div className="space-y-2">
          <Button 
            onClick={handleDownload} 
            disabled={downloading}
            className="w-full text-white font-medium h-10 rounded"
            style={{ backgroundColor: '#0D0A53' }}
          >
            {downloading ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download
              </>
            )}
          </Button>
          <Button 
            variant="outline"
            className="w-full font-medium h-8 rounded text-xs"
            style={{ borderColor: '#0D0A53', color: '#0D0A53' }}
          >
            Admin: Edit Resource
          </Button>
        </div>
      )
    }

    // Public resources - anyone can download
    if (resource.visibility === 'public') {
      return (
        <Button 
          onClick={handleDownload} 
          disabled={downloading}
          className="w-full text-white font-medium h-10 rounded"
          style={{ backgroundColor: '#0D0A53' }}
        >
          {downloading ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Free
            </>
          )}
        </Button>
      )
    }

    // Protected resources
    if (!user) {
      return (
        <Button 
          onClick={() => window.location.href = '/login'} 
          className="w-full text-white font-medium h-10 rounded"
          style={{ backgroundColor: '#0D0A53' }}
        >
          <Lock className="mr-2 h-4 w-4" />
          Sign in for Access
        </Button>
      )
    }

    // Logged in user - show request access button
    if (!requestStatus) {
      return (
        <Button 
          onClick={handleRequestAccess} 
          disabled={loading}
          className="w-full text-white font-medium h-10 rounded"
          style={{ backgroundColor: '#0D0A53' }}
        >
          {loading ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Requesting...
            </>
          ) : (
            <>
              <User className="mr-2 h-4 w-4" />
              Request Access
            </>
          )}
        </Button>
      )
    }

    if (requestStatus.status === 'pending') {
      return (
        <Button 
          disabled 
          className="w-full font-medium h-10 rounded"
          style={{ backgroundColor: '#FCF7F7', color: '#0D0A53', border: '1px solid #0D0A53' }}
        >
          <Clock className="mr-2 h-4 w-4" />
          Pending Approval
        </Button>
      )
    }

    if (requestStatus.status === 'denied') {
      return (
        <Button 
          disabled 
          className="w-full font-medium h-10 rounded"
          style={{ backgroundColor: '#FCF7F7', color: '#0D0A53', border: '1px solid #0D0A53' }}
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          Access Denied
        </Button>
      )
    }

    if (requestStatus.status === 'approved') {
      const isExpired = requestStatus.expires_at && new Date(requestStatus.expires_at) < new Date()
      
      if (isExpired) {
        return (
          <Button 
            disabled 
            className="w-full font-medium h-10 rounded"
            style={{ backgroundColor: '#FCF7F7', color: '#0D0A53', border: '1px solid #0D0A53' }}
          >
            <Clock className="mr-2 h-4 w-4" />
            Access Expired
          </Button>
        )
      }

      return (
        <Button 
          onClick={handleDownload} 
          disabled={downloading}
          className="w-full text-white font-medium h-10 rounded"
          style={{ backgroundColor: '#0D0A53' }}
        >
          {downloading ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Free
            </>
          )}
        </Button>
      )
    }

    return null
  }

  return (
    <Card className="relative border rounded-lg bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 w-full h-full flex flex-col" style={{ borderColor: '#0D0A53' }}>
      {/* Navy triangle in top-right corner */}
      <div className="absolute top-0 right-0 w-0 h-0 border-l-[16px] sm:border-l-[20px] border-l-transparent border-b-[16px] sm:border-b-[20px]" style={{ borderBottomColor: '#0D0A53' }}></div>
      
      <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
        <div className="flex flex-col items-start space-y-3 sm:space-y-4">
          {/* Icon */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded flex items-center justify-center" style={{ backgroundColor: '#FCF7F7', border: '2px solid #0D0A53' }}>
            <FileText className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: '#0D0A53' }} />
          </div>
          
          {/* Title */}
          <CardTitle className="text-lg sm:text-xl font-bold leading-tight line-clamp-2" style={{ color: '#0D0A53' }}>
            {resource.title}
          </CardTitle>
          
          {/* Description */}
          {resource.description && (
            <CardDescription className="text-xs sm:text-sm leading-relaxed line-clamp-3" style={{ color: '#0D0A53' }}>
              {resource.description}
            </CardDescription>
          )}
          
          {/* Type Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#FCF7F7', color: '#0D0A53', border: '1px solid #0D0A53' }}>
              {resource.type}
            </Badge>
            {resource.visibility === 'public' && (
              <Badge className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#C7A600', color: '#0D0A53' }}>
                Featured
              </Badge>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm" style={{ color: '#0D0A53' }}>
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3 sm:h-4 sm:w-4" style={{ color: '#C7A600' }} />
              <span>{Math.floor(resource.id.charCodeAt(0) * 7) % 1000 + 100}</span>
            </div>
            <div className="flex items-center gap-1">
              <span style={{ color: '#C7A600' }}>★</span>
              <span>4.{(resource.id.charCodeAt(1) % 9) + 1}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6 mt-auto">
        <div className="w-full">
          {getActionButton()}
        </div>
        
        {requestStatus?.expires_at && requestStatus.status === 'approved' && (
          <p className="text-xs mt-2 text-center" style={{ color: '#0D0A53' }}>
            Access expires: {new Date(requestStatus.expires_at).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
