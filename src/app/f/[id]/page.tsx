"use client";
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Page({ params }: { params: { id: string } }) {
  const fields = useQuery(api.form_fields.getBySlug, { slug: params.id });
  const formDetails = useQuery(api.forms.getBySlug, { slug: params.id });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const addResponse = useMutation(api.form_responses.addResponse);

  
  const schema: { [key: string]: any } = {};
  const defaultValues: { [key: string]: string } = {};
  fields?.forEach((field) => {
    schema[field.name] = z.string();
    defaultValues[field.name] = '';
  });
  const formSchema = z.object(schema);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = async(values: z.infer<typeof formSchema>) => {
    const missingFields = Object.keys(values).filter((field) => !values[field]);
    if (!missingFields || missingFields.length > 0) {
      alert(`Please fill out the following fields: ${missingFields?.join(', ')}`);
      return;
    }
    const responseValues = Object.keys(values).map((field) => ({
      name: field,
      value: values[field]
    }));
    await addResponse({ slug: params.id, values: responseValues });
    setIsSubmitted(true);
  };

  return <>
  {isSubmitted ? (
    <div>Your submission was recorded. Thank you ❤️</div>
  ) : (
    <>
    <h1>{formDetails?.name || params.id}</h1>
    <div>{formDetails?.description}</div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4">
        {fields && fields.map((userFormField, i) => (
          <div key={userFormField._id} >
            <FormField
              control={form.control}
              name={userFormField.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{field.name}</FormLabel>
                  <FormControl>
                    {userFormField.type === 'text' ? (
                    <Input type="text" placeholder="Your answer" {...field} />
                    ): (
                      <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {userFormField.selectOptions?.map((option: string) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                      </Select>
                    )}
                  </FormControl>
                </FormItem>
              )}
              />
          </div>
          ))}
      <Button type="submit">Submit</Button>
      </form>
    </Form>
  </>
  )}
  </>
}