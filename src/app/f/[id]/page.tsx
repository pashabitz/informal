"use client";
import { useQuery, Authenticated, Unauthenticated, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useState } from 'react';

export default function Page({ params }: { params: { id: string } }) {
  const fields = useQuery(api.form_fields.getFormFields, { formId: params.id });
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
    await addResponse({ formId: params.id, values: responseValues });
    setIsSubmitted(true);
  }
  return <>
  {isSubmitted ? (
    <div>Your submission was recorded. Thank you ❤️</div>
  ) : (
  <form onSubmit={handleSubmit}>
    <div>
      {fields && fields.map((field) => (
        <div key={field._id}>
          <input 
          type={field.type}
          name={field.name}
          placeholder={field.name}
          value={formValues[field.name] || ''}
          onChange={handleChange} 
        />
        </div>
      ))}
    </div>
    <button type="submit">Submit</button>
  </form>
  )}
  </>
}