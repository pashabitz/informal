"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery, Authenticated, Unauthenticated, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from "../../../../convex/_generated/dataModel";


export default function FormFields({ id }: { id: string } ) {
  const formDetails = useQuery(api.forms.get, { formId: id as Id<"forms"> });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const updateForm = useMutation(api.forms.update);

  useEffect(() => {
    if (formDetails) {
      setName(formDetails.name || '');
      setDescription(formDetails.description || '');
      setSlug(formDetails.slug || '');
    }
  }, [formDetails]);
  
  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (name.trim() === '') {
      alert("Please enter a form name");
      return;
    }
    if (slug.trim().length < 5) {
        alert("Slug must be at least 5 characters long");
        return;
    }
    if (slug.trim().includes(" ")) {
        alert("Slug cannot contain spaces");
        return;
    }
    try {
        await updateForm({ formId: id as Id<"forms">, name, description, slug });
    } catch (e: any) {
        alert(e.data);
    }
  };
  const formUrlRef = useRef<HTMLSpanElement>(null);
  const handleCopy = async () => {
    if(!formUrlRef.current) return;
    const formUrl = formUrlRef.current.innerText;
    await navigator.clipboard.writeText(formUrl);
  };
  return <>
  <div className="inline bg-slate-100 p-2 rounded">
    <span ref={formUrlRef}>{process.env.NEXT_PUBLIC_WEBSITE_URL}/f/{slug}</span>
    <button onClick={handleCopy} className="bg-none">📋</button>
  </div>&nbsp;
  <a href={`/f/${slug}`} target="_blank">preview ↗️</a>
  <p className="italic text-[var(--placeholder-color)]">Publish this URL to collect responses.</p>
  <form onSubmit={handleSubmit} className="mt-4">
    <label htmlFor="slug">Slug</label>
    <input type="text" name="slug" placeholder="Slug" value={slug} onChange={e => setSlug(e.target.value)} />
    <label htmlFor="name">Form name</label>
    <input type="text" name="name" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
    <label htmlFor="type">Form description</label>
    <input type="text" name="description" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
    <button type="submit">Save</button>
  </form>
  
  </>
}