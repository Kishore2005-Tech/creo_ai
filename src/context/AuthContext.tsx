import React, { createContext, useContext, useState, useEffect } from "react";
import { ClerkProvider, useUser, useClerk } from "@clerk/clerk-react";
import { AppUser } from "../types";

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isClerkConfigured: boolean;
  signOut: () => Promise<void>;
  signInWithDemo: (email: string) => void;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";
const isClerkActive = clerkPublishableKey && clerkPublishableKey !== "pk_test_...";

// Internal component that accesses Clerk context when it is active
function ClerkStateBridge({ children, isDemoMode, setDemoUser, signOutDemo }: { 
  children: React.ReactNode; 
  isDemoMode: boolean;
  setDemoUser: (user: AppUser | null) => void;
  signOutDemo: () => void;
}) {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  const [mappedUser, setMappedUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (!isClerkActive) return;

    if (isLoaded) {
      if (clerkUser) {
        setMappedUser({
          id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || null,
          name: clerkUser.fullName || null,
          avatarUrl: clerkUser.imageUrl || null,
        });
      } else {
        setMappedUser(null);
      }
    }
  }, [clerkUser, isLoaded]);

  const handleSignOut = async () => {
    if (isClerkActive) {
      await clerkSignOut();
    } else {
      signOutDemo();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: isClerkActive ? mappedUser : null,
        loading: isClerkActive ? !isLoaded : false,
        isClerkConfigured: isClerkActive,
        signOut: handleSignOut,
        signInWithDemo: () => {},
        isDemoMode: false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Demo Mode State for fallback
  const [demoUser, setDemoUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem("creo-demo-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [demoLoading, setDemoLoading] = useState(false);

  const signInWithDemo = (email: string) => {
    setDemoLoading(true);
    const mockUser: AppUser = {
      id: "user_demo_123",
      email: email || "demo@creo.ai",
      name: email ? email.split("@")[0] : "Creo Creator",
      avatarUrl: null,
    };
    localStorage.setItem("creo-demo-user", JSON.stringify(mockUser));
    setDemoUser(mockUser);
    setDemoLoading(false);
  };

  const signOutDemo = () => {
    localStorage.removeItem("creo-demo-user");
    setDemoUser(null);
  };

  const handleSignOut = async () => {
    signOutDemo();
  };

  // If Clerk key is configured, wrap with the ClerkProvider and run State Bridge
  if (isClerkActive) {
    return (
      <ClerkProvider publishableKey={clerkPublishableKey}>
        <ClerkStateBridge 
          isDemoMode={false} 
          setDemoUser={setDemoUser} 
          signOutDemo={signOutDemo}
        >
          {children}
        </ClerkStateBridge>
      </ClerkProvider>
    );
  }

  // Fallback / Demo Mode Provider when Clerk is not configured
  return (
    <AuthContext.Provider
      value={{
        user: demoUser,
        loading: demoLoading,
        isClerkConfigured: false,
        signOut: handleSignOut,
        signInWithDemo,
        isDemoMode: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAppAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAppAuth must be used within an AuthProvider");
  }
  return context;
}
