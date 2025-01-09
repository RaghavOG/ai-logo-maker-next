/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react'
import { useQuery } from 'convex/react'
import { useAuth } from '@clerk/nextjs'
import { Download } from 'lucide-react'
import { api } from '../../../convex/_generated/api'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

type Logo = {
  _id: string
  name: string
  base64: string
  description?: string
  _creationTime: number
}


const LogoCard = ({ logo }: { logo: Logo }) => {
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = logo.base64
    link.download = `${logo.name || 'logo'}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg truncate">{logo.name || 'Untitled Logo'}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg">
          <img
            src={logo.base64}
            alt={logo.name}
            className="object-contain w-full h-full"
          />
        </div>
        {logo.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {logo.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {new Date(logo._creationTime).toLocaleDateString()}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  )
}

const LoadingGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="h-full">
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3 mt-2" />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-24" />
        </CardFooter>
      </Card>
    ))}
  </div>
)

export default function DashboardPage() {
  const { userId, isLoaded } = useAuth()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const logos = useQuery(api.logo.getUserLogos, userId ? { userId } : 'skip')

  if (!mounted || !isLoaded) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Logos</h1>
        <LoadingGrid />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
          <p className="text-gray-600">Sign in to view your generated logos.</p>
        </div>
      </div>
    )
  }

  if (logos === undefined) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Logos</h1>
        <LoadingGrid />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Logos</h1>
      
      {logos.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">No logos yet</h2>
              <p className="text-gray-600 mb-4">
                Start creating your first logo to see it here.
              </p>
              <Button
                onClick={() => window.location.href = '/create'}
                className="inline-flex items-center"
              >
                Create Your First Logo
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {logos.map((logo) => (
            <LogoCard key={logo._id} logo={logo} />
          ))}
        </div>
      )}
    </div>
  )
}