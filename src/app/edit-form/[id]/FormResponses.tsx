"use client";
import { useState } from "react";
import { useQuery, Authenticated, Unauthenticated, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';


export default function FormResponses({ id }: { id: string } ) {
  const responses = useQuery(api.form_responses.getFormResponses, { formId: id });
  return <>
  <ol>
    {responses && responses.map((r) => (
      <li key={r._id} className="my-4">
        <div>
            {new Date(r._creationTime).toLocaleString()}
            <ol>
                {r.values.map((v: { name: string, value: string }) => (
                    <li key={v.name}>{v.name}: {v.value}</li>
                ))}
            </ol>
        </div>
        </li>
    ))}
  </ol>  
  </>
}