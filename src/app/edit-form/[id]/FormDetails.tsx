"use client";
import { useEffect, useRef, useState } from "react";
import { useQuery, Authenticated, Unauthenticated, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from "../../../../convex/_generated/dataModel";
import { z} from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  slug: z.string().min(5),
});

export default function FormFields({ id }: { id: string } ) {
  const formDetails = useQuery(api.forms.get, { formId: id as Id<"forms"> });
  const updateForm = useMutation(api.forms.update);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      slug: '',
    },
  });

  const watchSlug = form.watch('slug');
  
  useEffect(() => {
    if (formDetails) {
      form.setValue('name', formDetails.name || '');
      form.setValue('description', formDetails.description || '');
      form.setValue('slug', formDetails.slug || '');
    }
  }, [formDetails]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name, description, slug } = values;
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
    <span ref={formUrlRef}>{process.env.NEXT_PUBLIC_WEBSITE_URL}/f/{watchSlug}</span>
    <button onClick={handleCopy} className="bg-none">📋</button>
  </div>&nbsp;
  <a href={`/f/${watchSlug}`} target="_blank">preview ↗️</a>
  <p className="italic text-[var(--placeholder-color)]">Publish this URL to collect responses.</p>
  <Form {...form}>
  <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4">
    <FormField
    control={form.control}
    name="slug"
    render={({field}) => (
      <FormItem>
      <FormLabel>Slug</FormLabel>
      <FormControl>
      <Input type="text" {...field} />
      </FormControl>
      </FormItem>
    )} />
    <FormField
    control={form.control}
    name="name"
    render={({field}) => (
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
      <Input type="text" {...field} />
      </FormControl>
      </FormItem>
    )}/>
    <FormField
    control={form.control}
    name="description"
    render={({field}) => (
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
      <Input type="text" {...field} />
      </FormControl>
      </FormItem>
  
    )} />
    <Button type="submit">Save</Button>
  </form>
  </Form>
  </>
}