"use client";
import { useQuery, Authenticated, Unauthenticated, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { DetailedHTMLProps, InputHTMLAttributes, useEffect, useRef, useState } from 'react';
import { Id } from '../../../../convex/_generated/dataModel';

export default function Page({ params }: { params: { id: string } }) {
  const fields = useQuery(api.form_fields.getBySlug, { slug: params.id });
  const formDetails = useQuery(api.forms.getBySlug, { slug: params.id });
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const addResponse = useMutation(api.form_responses.addResponse);

  const handleChange = (event: { target: { name: string; value: string; }; }) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value
    });
  };
  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const missingFields = fields?.filter((field) => !formValues[field.name]);
    if (!missingFields || missingFields.length > 0) {
      alert(`Please fill out the following fields: ${missingFields?.map((field) => field.name).join(', ')}`);
      return;
    }
    console.log('submitting form with values:', formValues);
    const responseValues = fields?.map((field) => ({
      name: field.name,
      value: formValues[field.name]
    })) || [];
    await addResponse({ slug: params.id, values: responseValues });
    setIsSubmitted(true);
  }
  return <>
  {isSubmitted ? (
    <div>Your submission was recorded. Thank you ❤️</div>
  ) : (
  <form onSubmit={handleSubmit}>
    <div>
        <h1>{formDetails?.name || params.id}</h1>
        <div>{formDetails?.description}</div>
      {fields && fields.map((field, i) => (
        <div key={field._id}>
            <label htmlFor={field.name}>{field.name}</label>
            {field.type === 'text' ? (
          <input 
          type={field.type}
          name={field.name}
          placeholder={field.name}
          value={formValues[field.name] || ''}
          autoFocus={i === 0}
          onChange={handleChange} 
        />

            ): (
            <select
            name={field.name}
            value={formValues[field.name]}
            autoFocus={i === 0}
            onChange={handleChange}
            >
                <option value="">Select an option</option>
                {field.selectOptions?.map((option: string) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            )}
        </div>
      ))}
    </div>
    <button type="submit">Submit</button>
  </form>
  )}
  </>
}