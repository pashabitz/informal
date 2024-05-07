import React, { use } from 'react';
import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function UserForms() {
  const createForm = useMutation(api.forms.create);
  const handleCreateClick = async () => {
    const newFormId = await createForm({});
    console.log(`created form with id ${newFormId}`);
  };
  const forms = useQuery(api.forms.getUserForms, {});
    return <>
   {forms && forms.length > 0 ? (
    <table>
        <tbody>
        {forms.map((form) => (
            <tr key={form._id}>
                <td><a href={`/edit-form/${form._id}`}>{form._id}</a></td>
            </tr>
        ))}
        </tbody>
    </table>
   ) : (
        <p>You don&apos;t have any forms yet. </p>

   )}
   <button onClick={handleCreateClick}>Create</button>
    </>
}