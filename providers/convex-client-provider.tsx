"use client";

import { ClerkProvider, useAuth, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { AuthLoading, ConvexReactClient } from "convex/react";
import { Loading } from "@/components/auth/loading";

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({
  children,
}: ConvexClientProviderProps) => {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {/* Show loading if auth is not ready */}
        <AuthLoading>
          <Loading />
        </AuthLoading>

        {/* Show the app when signed in */}
        <SignedIn>
          {children}
        </SignedIn>

        {/* Show sign-in / sign-up when signed out */}
        <SignedOut>
          <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
            <h2 className="text-xl font-semibold">Please Sign In to continue</h2>
            <div className="flex space-x-4">
              <SignInButton mode="modal">
                <button className="px-4 py-2 bg-blue-600 text-white rounded">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 bg-green-600 text-white rounded">Sign Up</button>
              </SignUpButton>
            </div>
          </div>
        </SignedOut>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
