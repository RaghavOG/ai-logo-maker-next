'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth, UserButton, SignInButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from 'lucide-react'

const Header = () => {
  const { userId, isLoaded } = useAuth()
  const [mounted, setMounted] = React.useState(false)
  
  const data = useQuery(api.user.getUser, 
    userId && mounted ? { userId } : "skip"
  )

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const MobileMenu = () => {
    if (!userId) return null;
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6 text-white" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
          <DropdownMenuItem className="text-white text-xl focus:bg-gray-700">
            Credits Remaining: <span className="text-yellow-400 font-bold ml-2">{data?.creditsLeft ?? 0}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xl ">
            <Link href="/dashboard" className="text-white w-full">
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-gray-700">
          <span  className="text-xl text-white w-full">
              Profile
          </span>
            <div className="w-full flex justify-center">
              <UserButton 
                
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8 ring-2 ring-yellow-400 transition-all duration-300 hover:ring-4"
                  }
                }}
              />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (!isLoaded || !mounted) {
    return (
      <header className='px-2 py-2 sm:px-4 md:px-6 lg:px-32 xl:px-48 2xl:px-56 border-b-2 border-gray-900 bg-gradient-to-r from-gray-900 to-gray-800'>
        <div className='flex items-center justify-between'>
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-full sm:w-[50px] sm:h-[50px]" />
            <span className="text-xl sm:text-2xl md:text-4xl font-bold text-white">Logo Genix</span>
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
      className='px-2 py-2 sm:px-4 md:px-6 lg:px-32 xl:px-48 2xl:px-56 border-b-2 border-gray-900 bg-gradient-to-r from-gray-900 to-gray-800'
    >
      <div className='flex items-center justify-between'>
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="rounded-full sm:w-[50px] sm:h-[50px]" />
          </motion.div>
          <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">Logo Genix</span>
        </Link>
        
        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
          {userId ? (
            <>
              {/* Desktop view */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:block text-sm sm:text-base md:text-lg font-medium text-white whitespace-nowrap"
              > 
                Credits: <span className="text-yellow-400 font-bold">{data?.creditsLeft ?? 0}</span>
              </motion.div>
              <Link href="/dashboard" className="hidden md:block">
                <Button className="bg-white text-black text-sm sm:text-base md:text-lg font-semibold py-1 px-3 sm:py-2 sm:px-4 md:px-6 rounded-full transition-all duration-300 hover:bg-yellow-400 hover:text-white hover:scale-105 hover:shadow-lg">
                  Dashboard
                </Button>
              </Link>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1 }}
                className="hidden md:flex items-center"
              >
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-yellow-400 transition-all duration-300 hover:ring-4"
                    }
                  }}
                />
              </motion.div>
              
              {/* Mobile menu */}
              <MobileMenu />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <SignInButton mode="modal">
                <Button className="bg-white text-black text-sm sm:text-base md:text-lg font-semibold py-1 px-3 sm:py-2 sm:px-4 md:px-6 rounded-full transition-all duration-300 hover:bg-yellow-400 hover:text-white hover:scale-105 hover:shadow-lg">
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