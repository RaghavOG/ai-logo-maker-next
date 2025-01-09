"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { USerDetailsContext } from "@/app/_context/userContext";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { UserDetails } from "@/types";


  
function StyleProvider({ children }: { children: React.ReactNode }) {
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const { userId } = useAuth();
    const [mounted, setMounted] = useState(false);
      
    // Use conditional query with "skip"
    const data = useQuery(api.user.getUser, 
        userId && mounted ? { userId } : "skip"
    );
    
    useEffect(() => {
        setMounted(true);
    }, []);    

    // Update userDetails when data changes
    useEffect(() => {
        if (data) {
            setUserDetails(data);
        }
    }, [data]);

    return (
        <div className="bg-gradient-to-br from-blue-100 to-purple-100">
            <USerDetailsContext.Provider value={{ userDetails, setUserDetails }}>
                <Header />
                <div className='px-10 lg:px-32 xl:px-48 2xl:px-56'>
                    {children}
                </div>
                <Footer />
            </USerDetailsContext.Provider>
        </div>
    );
}

export default StyleProvider;