'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="h-[82vh] flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4 sm:px-6 lg:px-8">
     <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.h1 
          className="text-5xl sm:text-6xl md:text-8xl font-extrabold text-gray-900 mb-4"
          initial={{ scale: 0.9, rotateX: -90 }}
          animate={{ scale: 1, rotateX: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            duration: 1 
          }}
        >
          LogoGenix
        </motion.h1>
        <motion.p 
          className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Generate a logo you love in seconds at LogoGenix
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Link href="/logogen">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                Get Started
              </motion.span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

