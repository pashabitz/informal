"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery, Authenticated, Unauthenticated, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from "../../../../convex/_generated/dataModel";


export default function FormFields({ id }: { id: string } ) {
  const formDetails = useQuery(api.forms.get, { formId: id as Id<"forms"> });
  const [name, setName] = useState(formDetails?.name || '');
  const [description, setDescription] = useState(formDetails?.description || '');
  const updateForm = useMutation(api.forms.update);

  useEffect(() => {
    if (formDetails) {
      setName(formDetails.name || '');
      setDescription(formDetails.description || '');
    }
  }, [formDetails]);
  
  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (name.trim() === '') {
      alert("Please enter a form name");
      return;
    }
    await updateForm({ formId: id as Id<"forms">, name, description })
  };
  const formUrlRef = useRef<HTMLSpanElement>(null);
  const handleCopy = async () => {
    if(!formUrlRef.current) return;
    const formUrl = formUrlRef.current.innerText;
    await navigator.clipboard.writeText(formUrl);
  };
  return <>
  <div className="inline bg-slate-100 p-2 rounded">
    <span ref={formUrlRef}>{process.env.NEXT_PUBLIC_WEBSITE_URL}/f/{id}</span>
    <button onClick={handleCopy} className="bg-none">📋</button>
  </div>&nbsp;
  <a href={`/f/${id}`} target="_blank">preview ↗️</a>
  <form onSubmit={handleSubmit}>
    <label htmlFor="name">Form name</label>
    <input type="text" name="name" placeholder="Form name" value={name} onChange={e => setName(e.target.value)} />
    <label htmlFor="type">Form description</label>
    <input type="text" name="description" placeholder="Form description" value={description} onChange={e => setDescription(e.target.value)} />
  <button type="submit">Save</button>
  </form>
  
  </>
}