import React from 'react';
import { VoteButtonSchema } from '../schemas';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';

export default function VoteButtons({ upCount, downCount, upActive, downActive, onUp, onDown }) {
  const result = VoteButtonSchema.safeParse({
    upCount,
    downCount,
    upActive,
    downActive,
    onUp,
    onDown,
  });

  if (!result.success) return <h1>Invalid payload</h1>;

  return (
    <div className='flex gap-3 text-sm'>
      <button
        type='button'
        className={`inline-flex items-center gap-1 hover:bg-gray-200 px-2 py-1 rounded ${upActive && 'text-emerald-600 bg-emerald-50'}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onUp();
        }}
      >
        <ArrowBigUp className='h-4 w-4' /> <span>{upCount}</span>
      </button>
      <button
        type='button'
        className={`inline-flex items-center gap-1 hover:bg-gray-200 px-2 py-1 rounded ${downActive && 'text-rose-600 bg-rose-50'}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDown();
        }}
      >
        <ArrowBigDown className='h-4 w-4' /> <span>{downCount}</span>
      </button>
    </div>
  );
}
