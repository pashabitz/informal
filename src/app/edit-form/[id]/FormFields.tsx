"use client";
import { useState } from "react";
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from "../../../../convex/_generated/dataModel";


export default function FormFields({ id }: { id: string } ) {
  const [name, setName] = useState('');
  const [type, setType] = useState('text');
  const [selectOptions, setSelectOptions] = useState('');
  const formFields = useQuery(api.form_fields.getFormFields, { formId: id });
  const addField = useMutation(api.form_fields.addField);
  const deleteField = useMutation(api.form_fields.deleteField);

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
    setSelectOptions('');    
  };
    function handleDeleteField(id: Id<"form_fields">): void {
        console.log('delete field', id);
        deleteField({ fieldId: id })
    }

  return <>
  
  
  <h2>Form Fields</h2>
  <table className="min-w-[400px]">
    <thead>
        <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Options</th>
            <th></th>
        </tr>
    </thead>
  <tbody>
    {formFields && formFields.map((field) => (
      <tr key={field._id}>
        <td>{field.name}</td>
        <td>{field.type}</td>
        <td>{field.selectOptions?.join(",") || ""}</td>
        <td><span className="delete-button" onClick={e => handleDeleteField(field._id)}></span></td>
      </tr>
    ))}
    </tbody>
    </table>
  <form onSubmit={handleSubmit} className="my-4">
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
        <input
        type="text"
        name="select_options"
        placeholder="Option 1, Option 2, ..."
        value={selectOptions}
        onChange={e => setSelectOptions(e.target.value)} />
    )}
  <button type="submit">Add field</button>
  </form>
  
  </>
}