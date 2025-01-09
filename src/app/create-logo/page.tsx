'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {  SignInButton } from '@clerk/clerk-react'
import { useAuth } from '@clerk/nextjs'


const colorSchemes = [
  { name: 'Scheme 1', colors: ['#F6FEDB', '#E6D3A3', '#D8D174', '#B6C454', '#91972A'] },
  { name: 'Scheme 3', colors: ['#616163', '#44FFD2', '#87F6FF', '#DAF5FF', '#FFBFA0'] },
  { name: 'Scheme 4', colors: ['#F9E0D9', '#E6DBD0', '#7D6167', '#754F5B', '#5D4954'] },
  { name: 'Scheme 5', colors: ['#CACFD6', '#D6E5E3', '#9FD8CB', '#517664', '#2D3319'] },
  { name: 'Scheme 6', colors: ['#F3E0EC', '#EAD5E6', '#F2BEFC', '#CA9CE1', '#685F74'] },
  { name: 'Scheme 8', colors: ['#000505', '#3B3355', '#5D5D81', '#BFCDE0', '#FEFCFD'] },
 
]

const logoStyles = [
  'Cartoon Logo',
  'App Logo',
  'Modern Mascot Logos',
  'Black And White Line Logos',
  'Minimalists And Elegants Logos',
  'Vintage Custom Logos',
  'Modern Sharp Lined Logos',
  'Custom Luxury Logo Designs',
  'Vintage Logo Designs With Text & Icon',
]

interface ColorScheme {
  name: string;
  colors: string[];
}

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

export default function CreateLogoPage() {
  const [mounted, setMounted] = useState(false)
  const { userId , isLoaded  } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    colorScheme: '',
    logoStyle: '',
    customColors: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
  })

  
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const storedData = localStorage.getItem('logoFormData')
    if (storedData) {
      setFormData(JSON.parse(storedData))
    }
  }, [])

  // Prevent hydration errors by not rendering until mounted
  if (!mounted || !isLoaded) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      localStorage.setItem('logoFormData', JSON.stringify(newData))
      return newData
    })
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      localStorage.setItem('logoFormData', JSON.stringify(newData))
      return newData
    })
  }

  const handleColorSchemeSelect = (schemeName: string) => {
    const selectedScheme = colorSchemes.find(scheme => scheme.name === schemeName);
    setFormData(prev => {
      const newData = { ...prev, colorScheme: schemeName, customColors: selectedScheme ? selectedScheme.colors : prev.customColors };
      localStorage.setItem('logoFormData', JSON.stringify(newData));
      return newData;
    });
  };

  interface CustomColorChangeHandler {
    (index: number, color: string): void;
  }

  const handleCustomColorChange: CustomColorChangeHandler = (index, color) => {
    setFormData(prev => {
      const newColors = [...prev.customColors];
      newColors[index] = color;
      const newData = { ...prev, customColors: newColors, colorScheme: 'custom' };
      localStorage.setItem('logoFormData', JSON.stringify(newData));
      return newData;
    });
  };
  

  const handleNext = () => {
    if (step < 5) setStep(step + 1)
    else {
  console.log("step 5", formData)
      router.push('/logo-generator')  
    
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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-6">
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
                  onChange={handleTextareaChange}
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
                  {colorSchemes && colorSchemes.map((scheme) => (
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
              {
                step === 1 ? (
                  <Button onClick={() => router.push('/')} variant="outline">
                    Cancel
                  </Button>
                ) : null
              }
              {step > 1 && (
                <Button onClick={handleBack} variant="outline">
                  Back
                </Button>
              )}

              {
                step === 5  ?
                userId ? 
                (
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="ml-auto"
                  >
                    Generate Logo
                  </Button>
                  
                  
                ) :(
                  <SignInButton mode="modal"

                    >
                    <Button className="ml-auto">
                      Generate Logo
                    </Button>
                  </SignInButton>
                )
                :(
                  <Button
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="ml-auto"
                  >
                    Next
                  </Button>
                )
              }
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
            
  )
}