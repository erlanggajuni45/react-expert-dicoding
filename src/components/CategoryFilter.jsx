/* eslint-disable react/prop-types */
import React from 'react';
import { CategoryFilterSchema } from '../schemas';

export default function CategoryFilter({ categories, selected, onSelected }) {
  const result = CategoryFilterSchema.safeParse({ categories, selected, onSelected });
  if (!result.success) return <h1>Invalid Payload</h1>;

  return (
    <div className='mb-5 flex gap-3 text-sm'>
      Kategori:{' '}
      <button
        className={`rounded-xl border border-gray-300 px-2 ${
          selected === null && 'bg-indigo-600 text-white border-indigo-600'
        }`}
        onClick={() => onSelected(null)}
      >
        Semua
      </button>
      {categories.map((category) => (
        <button
          className={`rounded-xl border border-gray-300 px-2 ${
            selected === category && 'bg-indigo-600 text-white border-indigo-600'
          }`}
          onClick={() => onSelected(category)}
          key={category}
        >
          #{category}
        </button>
      ))}
    </div>
  );
}
