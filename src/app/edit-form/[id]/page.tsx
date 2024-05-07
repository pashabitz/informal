"use client";
import { Authenticated, Unauthenticated } from 'convex/react';

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