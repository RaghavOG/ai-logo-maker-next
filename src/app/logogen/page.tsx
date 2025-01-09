/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import axios from 'axios'
import { useAuth } from '@clerk/nextjs'
import { SignInButton } from '@clerk/clerk-react'

import { toast } from 'react-hot-toast'
import { Buffer } from 'buffer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

import { Check, Loader2, Download } from 'lucide-react'
// import { saveLogo } from '@/lib/actions/logo'
import { generatePrompt } from "@/app/logogen/_helper"
import { getImagePrompt } from "@/utils/ai-model"
import { colorSchemes, logoStyles } from "@/app/logogen/_helper"
import { ColorScheme, GenerationState, LogoFormData } from '@/types'
import { useMutation  } from "convex/react";
import { api } from "../../../convex/_generated/api";

const ColorSchemeCard = ({ scheme, selected, onClick }: { scheme: ColorScheme; selected: boolean; onClick: () => void }) => (
  <div 
    onClick={onClick}
    className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
      selected ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200 hover:border-gray-300'
    }`}
  >
    <div className="p-3">
      <p className="text-sm font-medium mb-2">{scheme.name}</p>
      <div className="flex h-12 rounded-md overflow-hidden">
        {scheme.colors.map((color, index) => (
          <div
            key={index}
            className="flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  </div>
)

interface CustomColorPickerProps {
  colors: string[];
  onChange: (index: number, color: string) => void;
}

const CustomColorPicker = ({ colors, onChange }: CustomColorPickerProps) => (
  <div className="p-3 border-2 border-gray-200 rounded-lg">
    <p className="text-sm font-medium mb-2">Custom Colors</p>
    <div className="flex gap-2">
      {colors && colors.map((color, index) => (
        <div key={index} className="flex flex-col items-center gap-1">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(index, e.target.value)}
            className="w-12 h-12 rounded cursor-pointer"
          />
        </div>
      ))}
    </div>
  </div>
)

const ProcessStep = ({ title, status }: { title: string; status: 'waiting' | 'loading' | 'completed' | 'error' }) => (
  <div className="flex items-center space-x-3">
    {status === 'loading' && (
      <div className="w-6 h-6">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </div>
    )}
    {status === 'completed' && (
      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
        <Check className="h-4 w-4 text-white" />
      </div>
    )}
    {status === 'waiting' && (
      <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
    )}
    {status === 'error' && (
      <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
        <span className="text-white font-bold">!</span>
      </div>
    )}
    <span className={`text-lg ${status === 'completed' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
      {title}
    </span>
  </div>
)

export default function CreateLogoPage() {
  const [mounted, setMounted] = useState(false)
  const { userId, isLoaded } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<LogoFormData>({
    title: '',
    description: '',
    colorScheme: '',
    logoStyle: '',
    customColors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
  })
  const [steps, setSteps] = useState({
    collecting: 'waiting',
    processing: 'waiting',
    generating: 'waiting',
    saving: 'waiting'
  } as Record<string, 'waiting' | 'loading' | 'completed' | 'error'>)
  const [generatedImage, setGeneratedImage] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [generationState, setGenerationState] = useState<GenerationState>({
    prompt: '',
    isGenerating: false,
    retryCount: 0,
    lastAttempt: 0
  })

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const storedData = localStorage.getItem('logoFormData')
    const storedStep = localStorage.getItem('logoGenerationStep')
    const storedSteps = localStorage.getItem('logoGenerationSteps')
    const storedImage = localStorage.getItem('generatedLogoImage')
    const storedGenerationState = localStorage.getItem('logoGenerationState')

    if (storedData) {
        setFormData(JSON.parse(storedData))
      }
      if (storedStep) {
        setStep(parseInt(storedStep))
      }
      if (storedSteps) {
        setSteps(JSON.parse(storedSteps))
      }
      if (storedImage) {
        setGeneratedImage(storedImage)
      }
       if (storedGenerationState) {
      const parsedState = JSON.parse(storedGenerationState)
      setGenerationState(parsedState)
      
      // If there was an ongoing generation, resume it
      if (parsedState.isGenerating && parsedState.prompt) {
        resumeImageGeneration(parsedState.prompt)
      }
    }

    setIsLoading(false)
}, [])

useEffect(() => {
    if (mounted) {
      localStorage.setItem('logoGenerationStep', step.toString())
      localStorage.setItem('logoGenerationSteps', JSON.stringify(steps))
      if (generatedImage) {
        localStorage.setItem('generatedLogoImage', generatedImage)
      }
    }
  }, [step, steps, generatedImage, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('logoGenerationState', JSON.stringify(generationState))
    }
  }, [generationState, mounted])


  const resumeImageGeneration = async (prompt: string) => {
    const currentTime = Date.now()
    const timeSinceLastAttempt = currentTime - generationState.lastAttempt

    // If last attempt was less than 10 seconds ago, wait before retrying
    if (timeSinceLastAttempt < 10000) {
      await new Promise(resolve => setTimeout(resolve, 10000 - timeSinceLastAttempt))
    }

    generateImage(prompt)
    clearStoredData()
  }
    
const saveLogo = useMutation(api.logo.saveLogo);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      localStorage.setItem('logoFormData', JSON.stringify(newData))
      return newData
    })
  }

  const clearStoredData = () => {
    localStorage.removeItem('logoFormData')
    localStorage.removeItem('logoGenerationStep')
    localStorage.removeItem('logoGenerationSteps')
    localStorage.removeItem('generatedLogoImage')
    localStorage.removeItem('logoGenerationState')
  }

  const handleColorSchemeSelect = (schemeName: string) => {
    const selectedScheme = colorSchemes.find(scheme => scheme.name === schemeName);
    setFormData(prev => {
      const newData = { ...prev, colorScheme: schemeName, customColors: selectedScheme ? selectedScheme.colors : prev.customColors };
      localStorage.setItem('logoFormData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleCustomColorChange = (index: number, color: string) => {
    setFormData(prev => {
      const newColors = [...prev.customColors];
      newColors[index] = color;
      const newData = { ...prev, customColors: newColors, colorScheme: 'custom' };
      localStorage.setItem('logoFormData', JSON.stringify(newData));
      return newData;
    });
  };

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1)
    } else {
      await startLogoGeneration()
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.title.trim() !== ''
      case 2: return formData.description.trim() !== ''
      case 3: return formData.colorScheme !== ''
      case 4: return formData.logoStyle !== ''
      default: return true
    }
  }

  const startLogoGeneration = async () => {
    setStep(6) 
    setSteps(prev => ({ ...prev, collecting: 'loading' }))

    try {
      setSteps(prev => ({ ...prev, collecting: 'completed', processing: 'loading' }))

      const prompt = generatePrompt(formData)
      const response = await getImagePrompt(prompt)



      setSteps(prev => ({ ...prev, processing: 'completed', generating: 'loading' }))

      setGenerationState(prev => ({
        ...prev,
        prompt: response.prompt,
        isGenerating: true,
        lastAttempt: Date.now()
      }))

      // Generating Image
      await generateImage(response.prompt)

    } catch (error) {
      console.error('Error in logo generation process:', error)
      setError('An error occurred while processing your request.')
      setSteps({
        collecting: 'error',
        processing: 'error',
        generating: 'error',
        saving: 'error'
      })
    }
  }

  const generateImage = async (prompt: string) => {
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/strangerzonehf/Flux-Midjourney-Mix2-LoRA",
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE}`,
            "Content-Type": "application/json",
          },
          responseType: 'arraybuffer',
          timeout: 500000 
        }
      )



      const base64Image = Buffer.from(response.data, 'binary').toString('base64')
      const base64ImageWithMime = `data:image/png;base64,${base64Image}`
      setSteps(prev => ({ ...prev, generating: 'completed', saving: 'loading' }))

      await handleSaveLogo(base64ImageWithMime)
      setSteps(prev => ({ ...prev, saving: 'completed' }))
      setGeneratedImage(base64ImageWithMime)

    } catch (error) {
      console.error('Error generating image:', error)
      if (generationState.retryCount < 3) {
        setGenerationState(prev => ({
          ...prev,
          retryCount: prev.retryCount + 1,
          lastAttempt: Date.now()
        }))
        
        // Wait 10 seconds before retrying
        setTimeout(() => {
          generateImage(prompt)
        }, 10000)
        
        toast.error('Image generation failed. Retrying...')
      } else {
        setError('Failed to generate the image after multiple attempts. Please try again.')
        setSteps(prev => ({ ...prev, generating: 'error' }))
        setGenerationState(prev => ({
          ...prev,
          isGenerating: false,
          retryCount: 0
        }))
        }
      
    }
  }

  const handleSaveLogo = async (imageData: string) => {
    if (!formData || !userId) return

    try {
      await saveLogo({
        userId,
        name: formData.title || 'Untitled Logo',
        description: formData.description || '',
        base64: imageData,
        styles: {
          colorPalette: formData.customColors || [],
          designIdea: formData.logoStyle || '',
          theme: formData.logoStyle || '',
        },
      })

      setSteps(prev => ({ ...prev, saving: 'completed' }))
      toast.success('Your logo has been generated and saved successfully')
      clearStoredData()
    } catch (error) {
        console.error('Error saving logo:', error.response || error.message || error);
      setSteps(prev => ({ ...prev, saving: 'error' }))
      toast.error('Failed to save the logo. Please try again.')
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = 'generated-logo.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!mounted || !isLoaded || isLoading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="h-40 flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-6">
            {step <= 5 && (
              <>
                {step === 1 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Logo Title</h2>
                    <p className="text-gray-600 mb-4">Add Your Business, App, or Website Name for a Custom Logo</p>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter your logo title"
                      className="w-full mb-4"
                    />
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Describe Your Logo Vision</h2>
                    <p className="text-gray-600 mb-4">Share your ideas, themes, or inspirations to create a logo that perfectly represents your brand or project</p>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your logo vision"
                      className="w-full mb-4"
                      rows={4}
                    />
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Choose Color Scheme</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {colorSchemes.map((scheme) => (
                        <ColorSchemeCard
                          key={scheme.name}
                          scheme={scheme}
                          selected={formData.colorScheme === scheme.name}
                          onClick={() => handleColorSchemeSelect(scheme.name)}
                        />
                      ))}
                    </div>
                    <CustomColorPicker
                      colors={formData.customColors}
                      onChange={handleCustomColorChange}
                    />
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Choose Your Logo Style</h2>
                    <p className="text-gray-600 mb-4">Select the type of logo design that best represents your brand&apos;s unique identity.</p>
                    <RadioGroup
                      value={formData.logoStyle}
                      onValueChange={(value) => setFormData(prev => {
                        const newData = { ...prev, logoStyle: value };
                        localStorage.setItem('logoFormData', JSON.stringify(newData));
                        return newData;
                      })}
                      className="space-y-2"
                    >
                      {logoStyles.map((style) => (
                        <div key={style} className="flex items-center space-x-2">
                          <RadioGroupItem value={style} id={style} />
                          <Label htmlFor={style}>{style}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Select Your AI Model Plan</h2>
                    <p className="text-gray-600 mb-4">Generate Unlimited Fast Logo with your favorite model</p>
                    <Card className="bg-gray-50 p-4">
                      <h3 className="text-xl font-semibold mb-2">Free</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Generate unlimited logos for free</li>
                        <li>Longer wait times</li>
                        <li>Wait time: 30 seconds to 3 minutes</li>
                        <li>Limited Design Options and Quality</li>
                        <li>Slow (Not Recommended)</li>
                      </ul>
                    </Card>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  {step === 1 ? (
                    <Button onClick={() => router.push('/')} variant="outline">
                      Cancel
                    </Button>
                  ) : (
                    <Button onClick={handleBack} variant="outline">
                      Back
                    </Button>
                  )}

                  {step === 5 ? (
                    userId ? (
                      <Button
                        onClick={handleNext}
                        disabled={!isStepValid()}
                        className="ml-auto"
                      >
                        Generate Logo
                      </Button>
                    ) : (
                      <SignInButton mode="modal">
                        <Button className="ml-auto">
                          Generate Logo
                        </Button>
                      </SignInButton>
                    )
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="ml-auto"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </>
            )}

            {step === 6 && (
              <div className="space-y-6">
                <ProcessStep title="Collecting Information" status={steps.collecting} />
                <ProcessStep title="Processing Request" status={steps.processing} />
                <ProcessStep title="Generating Image" status={steps.generating} />
                <ProcessStep title="Saving Result" status={steps.saving} />

                {generatedImage && (
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-center">
                      <img
                        src={generatedImage}
                        alt="Generated Logo"
                        className="w-[400px] h-[400px] object-contain rounded-lg shadow-lg"
                      />
                    </div>
                    <div className="flex justify-center">
                      <Button
                        onClick={handleDownload}
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Logo</span>
                      </Button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-center text-red-600">
                    <p>{error}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

