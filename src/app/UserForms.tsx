import React, { use } from 'react';
import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from '../../convex/_generated/dataModel';

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
    <h2 className="mt-0">Your forms:</h2>
    <table>
        <tbody>
        {forms.map((form) => (
            <tr key={form._id}>
                <td><a href={`/edit-form/${form._id}`}>{form._id}</a></td>
                <td>{form.name}</td>
                <td>{form.description}</td>
                <td><span onClick={(e) => handleDelete(form._id)} className="delete-button"></span></td>
            </tr>
        ))}
        </tbody>
    </table>
    </>
   ) : (
        <p>You don&apos;t have any forms yet. </p>

   )}
   <button onClick={handleCreateClick}>New</button>
    </>
}