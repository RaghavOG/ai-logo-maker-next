/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { USerDetailsContext } from '@/app/_context/userContext';
import { LogoFormData } from '@/types';
import { generatePrompt } from '@/app/logo-generator/_helper';
import { getImagePrompt } from '@/utils/ai-model';
import { Loader2, Check, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
);

const LogoGeneratorPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [steps, setSteps] = useState({
    collecting: 'waiting',
    processing: 'waiting',
    generating: 'waiting',
    saving: 'waiting'
  } as Record<string, 'waiting' | 'loading' | 'completed' | 'error'>);

  const [logoFormData, setLogoFormData] = useState<LogoFormData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadInitialData = async () => {
      const storedData = localStorage.getItem('logoFormData');
      if (storedData) {
        setLogoFormData(JSON.parse(storedData));
      }
      setIsLoading(false);
    };
    loadInitialData();
  }, []);

  const context = useContext(USerDetailsContext);
  const saveLogo = useMutation(api.logos.saveLogo);

  useEffect(() => {
    if (!isLoading && logoFormData && context?.userDetails?.userId) {
      console.log('Logo form data and user details found, initiating image generation');
    }
  }, [isLoading, logoFormData, context?.userDetails?.userId]);

  if (!context) {
    console.error('UserDetailsContext not found');
    throw new Error('LogoGeneratorPage must be used within a USerDetailsContext Provider');
  }

  const { userDetails } = context;



  useEffect(() => {
    setIsClient(true);
    console.log('Component mounted, setting isClient to true');
  }, []);

  const handleDownload = () => {
    if (!generatedImage) return;
    console.log('Initiating download');

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'generated-logo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateImage = async (prompt: string) => {
    console.log('Starting image generation with prompt');
    try {
      setSteps(prev => ({ ...prev, generating: 'loading' }));

      const response = await axios.post(
        "https://api-inference.huggingface.co/models/strangerzonehf/Flux-Midjourney-Mix2-LoRA",
        { inputs: prompt },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE}`,
            "Content-Type": "application/json",
          },
          responseType: 'arraybuffer'
        }
      );

      const base64Image = Buffer.from(response.data, 'binary').toString('base64');
      const base64ImageWithMime = `data:image/png;base64,${base64Image}`;
      setGeneratedImage(base64ImageWithMime);
      setSteps(prev => ({ ...prev, generating: 'completed' }));
    //   console.log('Image generation completed');

      


      await handleSaveLogo(base64ImageWithMime);
    console.log("Logo saved successfully")
    } catch (error) {
      console.error('Error generating image:', error);
      setError('Failed to generate the image. Please try again.');
      setSteps(prev => ({ ...prev, generating: 'error' }));
    }
  };

  const handleSaveLogo = async (imageData: string) => {
  


    if (!logoFormData || !context?.userDetails?.userId) return;
   
    try {
      setSteps(prev => ({ ...prev, saving: 'loading' }));
      console.log(
        {
          userId: userDetails?.userId,
          name: logoFormData.title || 'Untitled Logo',
          description: logoFormData.description || '',
          base64: imageData,
          styles: {
            colorPalette: logoFormData.customColors || [],
            designIdea: logoFormData.logoStyle || '',
            theme: logoFormData.logoStyle || '',
          },
        }
      )
      console.log('3. Logo data prepared:')

      await saveLogo({
        userId: userDetails?.userId,
        name: logoFormData.title || 'Untitled Logo',
        description: logoFormData.description || '',
        base64: imageData,
        styles: {
          colorPalette: logoFormData.customColors || [],
          designIdea: logoFormData.logoStyle || '',
          theme: logoFormData.logoStyle || '',
        },
      });

      setSteps(prev => ({ ...prev, saving: 'completed' }));
      console.log('Logo saved successfully');
      toast.success('Your logo has been generated and saved successfully');
    } catch (error) {
      console.error('Error saving logo:', error);
      setSteps(prev => ({ ...prev, saving: 'error' }));
      toast.error('Failed to save the logo. Please try again.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log('Starting data fetch process');
      const storedData = localStorage.getItem('logoFormData');
      if (!storedData) return;

      if (userDetails?.creditsLeft === 0 && !userDetails?.isPro) {
        console.log('Insufficient credits');
        setError("You don't have enough credits to generate a logo. Please upgrade to pro or purchase more credits.");
        return;
      }

      try {
        setSteps(prev => ({ ...prev, collecting: 'loading' }));
        const parsedData = JSON.parse(storedData) as LogoFormData;
        setLogoFormData(parsedData);
        setSteps(prev => ({ ...prev, collecting: 'completed', processing: 'loading' }));

        const prompt = generatePrompt(parsedData);

        const response = await getImagePrompt(prompt);
        // const response = {prompt}

        setSteps(prev => ({ ...prev, processing: 'completed' }));
        console.log('Initial data processing completed');

        if (response.error) {
          throw new Error(response.error);
        }

        await generateImage(response.prompt);
      } catch (error) {
        console.error('Error in data fetching process:', error);
        setError('An error occurred while processing your request.');
        setSteps(prev => ({
          collecting: 'error',
          processing: 'error',
          generating: 'error',
          saving: 'error'
        }));
      }
    };

    if (isClient) {
      fetchData();
    }
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="min-h-screen p-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-48" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !generatedImage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <span className="text-red-600 text-2xl font-bold">!</span>
              </div>
              <h2 className="text-xl font-semibold text-red-600">Generation Failed</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <Card className="mb-6">
        <CardContent className="pt-6 space-y-6">
          <ProcessStep title="Collecting Information" status={steps.collecting} />
          <ProcessStep title="Processing Request" status={steps.processing} />
          <ProcessStep title="Generating Image" status={steps.generating} />
          <ProcessStep title="Saving Result" status={steps.saving} />
        </CardContent>
      </Card>

      {generatedImage ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
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
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center">
              <Skeleton className="w-[400px] h-[400px] rounded-lg" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LogoGeneratorPage;
