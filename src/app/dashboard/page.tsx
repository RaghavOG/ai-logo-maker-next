/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react'
import { useQuery } from 'convex/react'
import { useAuth } from '@clerk/nextjs'
import { Download, Plus } from 'lucide-react'
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
    <Card className="h-full flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-lg">
      <CardHeader className="p-4">
        <CardTitle className="text-xl font-semibold truncate">{logo.name || 'Untitled Logo'}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          <img
            src={logo.base64}
            alt={logo.name}
            className="object-contain w-full h-full"
          />
        </div>
        {logo.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {logo.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 bg-gray-50">
        <span className="text-sm text-gray-500">
          {new Date(logo._creationTime).toLocaleDateString()}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 hover:bg-gray-200"
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
        <CardHeader className="p-4">
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="p-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <Skeleton className="h-4 w-2/3 mt-3" />
        </CardContent>
        <CardFooter className="flex justify-between p-4">
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
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Your Logos</h1>
        <LoadingGrid />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Please Sign In</h1>
          <p className="text-xl text-gray-600">Sign in to view your generated logos.</p>
        </div>
      </div>
    )
  }

  if (logos === undefined) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Your Logos</h1>
        <LoadingGrid />
      </div>
    )
  }

  return (
    <div className="min-h-screen container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Your Logos</h1>
      
      {logos.length === 0 ? (
        <Card className="bg-white shadow-md">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">No logos yet</h2>
              <p className="text-lg text-gray-600 mb-6">
                Start creating your first logo to see it here.
              </p>
              <Button
                onClick={() => window.location.href = '/logogen'}
                className="inline-flex items-center px-6 py-3 text-lg font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Logo
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {logos.map((logo) => (
            <LogoCard key={logo._id} logo={logo} />
          ))}
        </div>
      )}
    </div>
  )
}

