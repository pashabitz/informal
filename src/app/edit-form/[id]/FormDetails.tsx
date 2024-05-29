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
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useCopyToClipboard } from "react-use";

const formSchema = z.object({
  name: z.string(),
  description: z.string(),
  slug: z.string().min(5),
});

export default function FormFields({ id }: { id: string } ) {
  const formDetails = useQuery(api.forms.get, { formId: id as Id<"forms"> });
  const updateForm = useMutation(api.forms.update);
  const { toast } = useToast();
  const [, copyToClipboard] = useCopyToClipboard();

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
        toast({
            description: 'Your form has been updated',
        });
    } catch (e: any) {
        alert(e.data);
    }
  };

  const handleCopy = () => {
    const formUrl = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/f/${watchSlug}`;
    copyToClipboard(formUrl);
    toast({
      title: 'Copied',
      description: formUrl,
    });
  };
  return <>
  <div className="rounded">
    <Label>Publish this URL to collect responses:</Label>
    <Input type="text" disabled value={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/f/${watchSlug}`} />
    <Button onClick={handleCopy} >Copy Link</Button>
    <Button onClick={() => window.open(`/f/${watchSlug}`, '_blank')}>Open Form</Button>
  </div>&nbsp;
  <Form {...form}>
  <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4">
    <div>
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
    </div>
    <div>
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
    </div>
    <div>
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
    </div>
    <Button type="submit">Save</Button>
  </form>
  </Form>
  </>
}