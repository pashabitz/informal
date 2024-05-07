"use client";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";

export default function Header() {
  
  return (
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
    );
}
