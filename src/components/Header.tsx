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
  
  const data = useQuery(api.user.getUser, 
    userId && mounted ? { userId } : "skip"
  )

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!isLoaded || !mounted) {
    return (
      <header className='px-4 py-4 lg:px-32 xl:px-48 2xl:px-56 border-b-2 border-gray-900 bg-gradient-to-r from-gray-900 to-gray-800'>
        <div className='flex items-center justify-between'>
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.jpg" alt="Logo" width={50} height={50} className="rounded-full" />
            <span className="text-4xl font-bold text-white">Logo Genix</span>
          </Link>
        </div>
      </header>
    )
  }

  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='px-4 py-4 lg:px-32 xl:px-48 2xl:px-56 border-b-2 border-gray-900 bg-gradient-to-r from-gray-900 to-gray-800'
    >
      <div className='flex items-center justify-between'>
        <Link href="/" className="flex items-center space-x-3 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Image src="/logo.jpg" alt="Logo" width={50} height={50} className="rounded-full" />
          </motion.div>
          <span className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">Logo Genix</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          {userId ? (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-lg font-medium text-white"
              > 
                Credits: <span className="text-yellow-400 font-bold">{data?.creditsLeft ?? 0}</span>
              </motion.div>
              <Link href="/dashboard">
                <Button className="bg-white text-black text-lg font-semibold py-2 px-6 rounded-full transition-all duration-300 hover:bg-yellow-400 hover:text-white hover:scale-105 hover:shadow-lg">
                  Dashboard
                </Button>
              </Link>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
              >
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-10 w-10 ring-2 ring-yellow-400 transition-all duration-300 hover:ring-4"
                    }
                  }}
                />
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <SignInButton mode="modal">
                <Button className="bg-white text-black text-lg font-semibold py-2 px-6 rounded-full transition-all duration-300 hover:bg-yellow-400 hover:text-white hover:scale-105 hover:shadow-lg">
                  Log In
                </Button>
              </SignInButton>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  )
}

export default Header

