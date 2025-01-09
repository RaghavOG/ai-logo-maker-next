'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth, UserButton, SignInButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const Header = () => {
  const { userId, isLoaded } = useAuth()
  const [mounted, setMounted] = React.useState(false)
  
  // Use conditional query with "skip"
  const data = useQuery(api.user.getUser, 
    userId && mounted ? { userId } : "skip"
  )

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until both Clerk is loaded and component is mounted
  if (!isLoaded || !mounted) {
    return (
      <header className='px-4 py-4 lg:px-32 xl:px-48 2xl:px-56 border border-b-2 border-gray-900'>
        <div className='flex items-center justify-between'>
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-full" />
            <span className="text-xl font-bold">Logo Genix</span>
          </Link>
        </div>
      </header>
    )
  }

  return (
    <header className='px-4 py-4 lg:px-32 xl:px-48 2xl:px-56 border border-b-2 border-gray-900'>
      <div className='flex items-center justify-between'>
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-full" />
          <span className="text-xl font-bold">Logo Genix</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {userId ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-base font-medium"
              > 
                Credits: {data?.creditsLeft ?? 0}
              </motion.div>
              <Link href="/dashboard">
                <Button className="bg-white text-black transition-transform duration-200 hover:scale-105 hover:bg-gray-200">
                  Dashboard
                </Button>
              </Link>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10 transition-transform duration-200 hover:scale-110"
                    }
                  }}
                />
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SignInButton mode="modal">
                <Button className="bg-white text-black transition-transform duration-200 hover:scale-105 hover:bg-gray-200">
                  Get Started
                </Button>
              </SignInButton>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header