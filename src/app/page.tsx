"use client";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";

export default function Home() {
  return (
    <div>
      <header className="border-2 border-blue flex justify-between items-center">
        <h1 className="ml-2">Informal</h1>
        <div className="inline-block mr-2">
          <Unauthenticated>
            <SignInButton/>
          </Unauthenticated>
          <Authenticated>
            <UserButton />
          </Authenticated>
        </div>
      </header>
    <main className="min-h-[80vh]">
      <Unauthenticated>
        Welcome to Informal. Sign in to start creating forms.
      </Unauthenticated>
        <Authenticated>
          You don&apos;t have any forms yet. Create one.
        </Authenticated>
        
    </main>
    <footer>Footer</footer>
    </div>
  );
}
