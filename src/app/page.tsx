"use client";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import UserForms from "./UserForms";

export default function Home() {
  
  return ( <>
      
    <Unauthenticated>
      <div className="grid place-content-center h-lvh text-2xl">Welcome to Informal. Sign in to start creating forms.</div>
    </Unauthenticated>
    <Authenticated>
    <UserForms />
    </Authenticated>
  </>);
}
