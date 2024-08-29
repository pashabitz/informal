"use client";
import { useState } from "react";
import { useQuery, Authenticated, Unauthenticated, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Id } from "../../../../convex/_generated/dataModel";


export default function FormResponses({ id }: { id: Id<"forms"> } ) {
  const responses = useQuery(api.form_responses.getFormResponses, { formId: id });
return (
    <>
        {responses && responses.length > 0 ? (
            <>
                {responses.map((r) => (
                        <Card key={r._id} className="w-full my-2">
                            <CardHeader>
                                <CardTitle>
                            {new Date(r._creationTime).toLocaleString()}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {r.values.map((v: { name: string, value: string }) => (
                                    <li key={v.name}>{v.name}: {v.value}</li>
                                ))}
                            </CardContent>
                        </Card>
                ))}
            </>
        ) : (
            <p>None yet. Share the form&apos;s URL to collect responses.</p>
        )}
    </>
);
}