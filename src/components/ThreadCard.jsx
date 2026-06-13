/* eslint-disable react/prop-types */

import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import React from 'react';
import { ThreadCardSchema } from '../schemas';
import UpDownVote from './VoteButtons';
import VoteButtons from './VoteButtons';

export default function ThreadCard({ thread, owner }) {
  const result = ThreadCardSchema.safeParse({ thread, owner });

  if (!result.success) {
    return <h1>Invalid Props</h1>;
  }

  return (
    <div className='bg-white rounded-xl p-4 my-1 shadow-sm'>
      <header className='flex items-center gap-2'>
        <img
          src={owner.avatar}
          alt={owner.name}
          className='rounded-full h-8 w-8 '
        />
        <span>
          {owner.name} <span>·</span>{' '}
          <span className='text-black/50'>
            {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
          </span>
        </span>
        <div className='bg-slate-200 px-2 py-1 rounded-md ml-auto text-xs font-semibold'>
          #{thread.category}
        </div>
      </header>
      <div className='mt-3'>
        <h3 className='text-xl font-semibold'>{thread.title}</h3>
        <div
          className='mt-3 line-clamp-2 text-zinc-500'
          dangerouslySetInnerHTML={{ __html: thread.body }}
        />
      </div>
      <div className='mt-3 flex pr-2'>
        <VoteButtons thread={thread} />
        <span className='ml-auto flex items-center gap-2'>
          <MessageCircle className='h-4 w-4' />
          {thread.totalComments}
        </span>
      </div>
    </div>
  );
}
