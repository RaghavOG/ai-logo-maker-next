import { createContext } from "react";
import { UserDetailsContextType } from "@/types";

// Create the context with the default value being null
export const USerDetailsContext = createContext<UserDetailsContextType | null>(null);
