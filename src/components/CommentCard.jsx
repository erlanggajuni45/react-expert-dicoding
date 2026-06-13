/* eslint-disable react/prop-types */

import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import z from 'zod';

const CommentCardSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  content: z.string(),
  owner: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string(),
  }),
  upVotesBy: z.array(z.string()),
  downVotesBy: z.array(z.string()),
});

export default function CommentCard({ comment }) {
  const result = CommentCardSchema.safeParse(comment);

  if (!result.success) return <h1>Invalid Payload</h1>;

  const { owner, createdAt, content } = comment;
  return (
    <div className='rounded-lg border border-slate-200 bg-white p-4 flex flex-col gap-2'>
      <div className='flex gap-2 items-center'>
        <img
          src={owner.avatar}
          alt={owner.name}
          className='rounded-full h-8 w-8'
        />
        <p className='font-normal'>{owner.name}</p>
        <p className='text-black/50'>
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
