"use client";
import { useState } from "react";
import { useQuery, Authenticated, Unauthenticated, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';


export default function FormFields({ id }: { id: string } ) {
  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  const formFields = useQuery(api.form_fields.getFormFields, { formId: id });
  const addField = useMutation(api.form_fields.addField);
  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (name.trim() === '') {
      alert("Please enter a field name");
      return;
    }
    const numberOfExistingFields = formFields ? formFields.length : 0;
    await addField({ formId: id, name, type, order: numberOfExistingFields + 1 })
    setName('');
  };
  return <>
  <h1>Form: {id}&nbsp;<a href={`/f/${id}`} target="_blank">preview </a></h1>
  
  <h2>Fields:</h2>
  <ol>
    {formFields && formFields.map((field) => (
      <li key={field._id}>{field.name} {field.type} {field.order}</li>
    ))}
  </ol>
  <h2>Add field:</h2>
  <form onSubmit={handleSubmit}>
    <label htmlFor="name">Field name</label>
    <input type="text" name="name" placeholder="Field name" value={name} onChange={e => setName(e.target.value)} />
    <label htmlFor="type">Field type</label>
    <input type="text" name="type" placeholder="Field type" value={type} disabled />
  <button type="submit">Add field</button>
  </form>
  
  </>
}