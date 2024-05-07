"use client";
import { useState } from "react";
import { useQuery, Authenticated, Unauthenticated, useMutation } from 'convex/react';
import { useRouter } from 'next/router'
import { api } from '../../../../convex/_generated/api';
import FormFields from "./FormFields";

export default function Page({ params }: { params: { id: string } }) {
  
  return <>
  <Unauthenticated>
    Please sign in.
  </Unauthenticated>
  <Authenticated>
  <FormFields id={params.id} />
  </Authenticated>
  
  </>
}