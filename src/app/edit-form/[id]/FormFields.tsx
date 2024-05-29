"use client";
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from "../../../../convex/_generated/dataModel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string(),
  type: z.string().refine((value) => ['text', 'select'].includes(value)),
  select_options: z.optional(z.string()),
});

export default function FormFields({ id }: { id: string } ) {
  const formFields = useQuery(api.form_fields.getFormFields, { formId: id });
  const addField = useMutation(api.form_fields.addField);
  const deleteField = useMutation(api.form_fields.deleteField);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: '',
      select_options: '',
    },
  });
  
  const watchType = form.watch('type');

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const { name, type, select_options } = values;
    if (name.trim() === '') {
      alert("Please enter a field name");
      return;
    }
    const numberOfExistingFields = formFields ? formFields.length : 0;
    const field = { 
        formId: id, 
        name, 
        type, 
        order: numberOfExistingFields + 1, 
        selectOptions: undefined as string[] | undefined,
    };
    if (type === 'select') {
      field.selectOptions = select_options?.split(',').map((option: string) => option.trim());
      if (!field.selectOptions) {
        alert("Please enter options for a select field");
        return;
      }
    }
    await addField(field)
    form.setValue('name', '');
    form.setValue('select_options', '');
  };
  
  function handleDeleteField(id: Id<"form_fields">): void {
      console.log('delete field', id);
      deleteField({ fieldId: id })
  }

  return <>
  
  
  <h2>Form Fields</h2>
  <Table className="min-w-[400px]">
    <TableHeader>
        <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Options</TableHead>
            <TableHead></TableHead>
        </TableRow>
    </TableHeader>
  <TableBody>
    {formFields && formFields.map((field) => (
      <TableRow key={field._id}>
        <TableCell>{field.name}</TableCell>
        <TableCell>{field.type}</TableCell>
        <TableCell>{field.selectOptions?.join(",") || ""}</TableCell>
        <TableCell><span className="delete-button" onClick={e => handleDeleteField(field._id)}></span></TableCell>
      </TableRow>
    ))}
    </TableBody>
    </Table>
    <Form {...form}>
  <form onSubmit={form.handleSubmit(handleSubmit)} className="edit-fields-form">
<div>
<FormField
    control={form.control}
    name="name"
    render={({field}) => (
      <FormItem>
      <FormControl>
      <Input type="text" placeholder="Field name" {...field} />
      </FormControl>
      </FormItem>
    )} />
    
</div>
<div>
<FormField
  control={form.control}
  name="type"
  render={({field}) => (
  <FormItem>
    <Select onValueChange={field.onChange} defaultValue={field.value}>
    <FormControl>
    <SelectTrigger className="w-40">
      <SelectValue placeholder="Field type" />
      </SelectTrigger>
    </FormControl>
    <SelectContent>
      <SelectItem value="text">Text</SelectItem>
      <SelectItem value="select">Select</SelectItem>
    </SelectContent>
    </Select>
  </FormItem>
  )} />
</div>
    {watchType === 'select' && (
      <div>
        <FormField
    control={form.control}
    name="select_options"
    render={({field}) => (
      <FormItem>
      <FormControl>
      <Input type="text" placeholder="Option 1, Option 2, ..." {...field} />
      </FormControl>
      </FormItem>
    )} />
        </div>
    )}
  <Button type="submit">Add field</Button>
  </form>
  </Form>
  </>
}