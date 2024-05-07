"use client";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import UserForms from "./UserForms";

export default function Home() {
  
  return ( <>
      
    <Unauthenticated>
        Welcome to Informal. Sign in to start creating forms.
      </Unauthenticated>
      <Authenticated>
      <UserForms />
      </Authenticated>
  </>);
}
