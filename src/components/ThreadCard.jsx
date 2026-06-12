/* eslint-disable react/prop-types */

import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import z from 'zod';

const ThreadCardSchema = z.object({
  thread: z.object({
    id: z.string(),
    title: z.string(),
    body: z.string(),
    category: z.string(),
    createdAt: z.string(),
    ownerId: z.string(),
    totalComments: z.number(),
    upVotesBy: z.array(z.string()),
    downVotesBy: z.array(z.string()),
  }),
  owner: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    avatar: z.string(),
  }),
});

export default function ThreadCard({ thread, owner }) {
  const result = ThreadCardSchema.safeParse({ thread, owner });

  if (!result.success) {
    return <h1>Invalid Props</h1>;
  }

  return (
    <div className='bg-white rounded-md p-4 shadow-sm'>
      <header className='flex items-center gap-2'>
        <img
          src={owner.avatar}
          alt={owner.name}
          className='rounded-full h-8 w-8 '
        />
        <span>
          {owner.name} <span>·</span>{' '}
          <span className='text-black/50'>{formatDistanceToNow(new Date(thread.createdAt))}</span>
        </span>
        <div className='bg-slate-200 px-2 py-1 rounded-md ml-auto text-xs font-semibold'>
          #{thread.category}
        </div>
      </header>
      <div className='line-clamp-2'></div>
    </div>
  );
}
