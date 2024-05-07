"use client";
import { Authenticated, Unauthenticated } from 'convex/react';

import FormFields from "./FormFields";
import FormResponses from './FormResponses';

export default function Page({ params }: { params: { id: string } }) {
  
  return <>
  <Unauthenticated>
    Please sign in.
  </Unauthenticated>
  <Authenticated>
  <FormFields id={params.id} />
  <h2>Responses:</h2>
  <FormResponses id={params.id} />
  </Authenticated>
  
  </>
}