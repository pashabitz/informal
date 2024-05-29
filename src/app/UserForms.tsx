import React, { use } from 'react';
import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from '../../convex/_generated/dataModel';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function UserForms() {
  const createForm = useMutation(api.forms.create);
  const handleCreateClick = async () => {
    const newFormId = await createForm({});
    // redirect to form page
    window.location.href = `/edit-form/${newFormId}`;
  };
  const deleteForm = useMutation(api.forms.deleteForm);
  const handleDelete = async (formId: Id<"forms">) => {
    try {
        await deleteForm({ formId });
    } catch (e: any) {
        alert(e.data);
    }
    
  }

  const forms = useQuery(api.forms.getUserForms, {});
    return <>
   {forms && forms.length > 0 ? (
    <>
    <h2 className="mt-0">Your forms</h2>
    <Table>
        <TableBody>
        {forms.map((form) => (
            <TableRow key={form._id}>
                <TableCell><a href={`/edit-form/${form._id}`}>{form._id}</a></TableCell>
                <TableCell>{form.name}</TableCell>
                <TableCell>{form.description}</TableCell>
                <TableCell><span onClick={(e) => handleDelete(form._id)} className="delete-button"></span></TableCell>
            </TableRow>
        ))}
        </TableBody>
    </Table>
    </>
   ) : (
        <p>You don&apos;t have any forms yet. </p>

   )}
   <Button onClick={handleCreateClick}>New</Button>
    </>
}