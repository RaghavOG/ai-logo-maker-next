'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-[82vh] flex items-center bg-gradient-to-br from-blue-100 to-purple-100 px-4 sm:px-6 lg:px-8 py-12">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-left space-y-6"
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              duration: 1 
            }}
          >
            Create Your
            <br />
            <span className="text-blue-600">Perfect Logo</span>
            <br />
            By LogoGenix
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-xl text-gray-600 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Generate unique, professional logos with our AI-powered platform. Perfect for businesses of all sizes.
          </motion.p>
          <motion.p 
            className="text-lg md:text-lg text-gray-600 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >

            Powered by AI model:{" "} Flux-Midjourney-Mix2-LoRA
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Link href="/logogen">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 text-xl"
              >
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right side - Image Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative grid grid-cols-2 gap-4 max-w-xl mx-auto lg:mx-0"
        >
          {/* Top left image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-2xl overflow-hidden shadow-lg bg-white p-4"
          >
            <Image
              src="/hero-img0.png"
              alt="Logo Example 1"
              width={400}
              height={400}
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Top right image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-2xl overflow-hidden shadow-lg bg-[#4A3C31] p-4 mt-8"
          >
            <Image
              src="/hero-img3.jpeg"
              alt="Logo Example 2"
              width={400}
              height={400}
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Bottom left image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="rounded-2xl overflow-hidden shadow-lg bg-[#1B2937] p-4"
          >
            <Image
              src="/hero-img4.jpeg"
              alt="Logo Example 3"
              width={400}
              height={400}
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Bottom right image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="rounded-2xl overflow-hidden shadow-lg bg-black p-4 mt-8"
          >
            <Image
              src="/hero-img5.jpeg"
              alt="Logo Example 4"
              width={400}
              height={400}
              className="w-full h-full object-contain"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}