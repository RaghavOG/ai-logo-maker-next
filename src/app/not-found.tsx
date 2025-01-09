'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  return (
    <div className="h-[77vh]  flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <Image
          src="/logo.jpg"
          alt="Logo Genix"
          width={80}
          height={80}
          className="mx-auto rounded-full mb-8 shadow-lg"
        />
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl sm:text-6xl font-bold text-red-900 mb-4"
        >
          404
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl sm:text-2xl text-gray-600 mb-8"
        >
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link href="/">
            <Button className="bg-white text-black transition-transform duration-200 hover:scale-105 hover:bg-gray-200 text-lg px-8 py-3">
              Go Back Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>
      
    </div>
  )
}

export default NotFound

