"use client";
import { useRouter } from 'next/router'

export default function Page({ params }: { params: { id: string } }) {
  return <div>Form: {params.id}</div>
}