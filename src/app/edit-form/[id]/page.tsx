"use client";
import { Authenticated, Unauthenticated } from 'convex/react';

import FormFields from "./FormFields";
import FormResponses from './FormResponses';
import FormDetails from './FormDetails';
import { Id } from '../../../../convex/_generated/dataModel';

export default function Page({ params }: { params: { id: Id<"forms"> } }) {
  
  return <>
  <Unauthenticated>
    Please sign in.
  </Unauthenticated>
  <Authenticated>
  <FormDetails id={params.id} />
  <hr />
  <FormFields id={params.id} />
  <hr />
  <h2>Responses</h2>
  <FormResponses id={params.id} />
  </Authenticated>
  
  </>
}