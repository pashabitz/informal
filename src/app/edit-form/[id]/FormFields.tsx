"use client";
import { useState } from "react";
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';


export default function FormFields({ id }: { id: string } ) {
  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  const [selectOptions, setSelectOptions] = useState('');
  const formFields = useQuery(api.form_fields.getFormFields, { formId: id });
  const addField = useMutation(api.form_fields.addField);

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
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
      field.selectOptions = selectOptions.split(',').map((option: string) => option.trim());
    }
    await addField(field)
    setName('');
  };
  return <>
  
  
  <h2>Fields:</h2>
  <ol>
    {formFields && formFields.map((field) => (
      <li key={field._id}>{field.name} {field.type} {field.selectOptions?.join(",") || ""}</li>
    ))}
  </ol>
  <h2>Add field:</h2>
  <form onSubmit={handleSubmit}>
    <label htmlFor="name">Field name</label>
    
    <input 
    type="text" 
    name="name" 
    placeholder="Field name" 
    value={name} 
    onChange={e => setName(e.target.value)} />

    <label htmlFor="type">Field type</label>
    <select name="type" onChange={e => setType(e.target.value)}>
        <option value="text">Text</option>
        <option value="select">Select</option>
    </select>
    {type === 'select' && (
        <input type="text" name="select_options" placeholder="Option 1, Option 2, ..." onChange={e => setSelectOptions(e.target.value)} />
    )}
  <button type="submit">Add field</button>
  </form>
  
  </>
}