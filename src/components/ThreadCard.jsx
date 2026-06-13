/* eslint-disable react/prop-types */

import { formatDistanceToNow } from 'date-fns';
import { MessageCircle } from 'lucide-react';
import React from 'react';
import { ThreadCardSchema } from '../schemas';
import VoteButtons from './VoteButtons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { asyncApplyVoteThread } from '../states/threads/action';
import { toast } from 'sonner';

export default function ThreadCard({ thread, owner }) {
  const result = ThreadCardSchema.safeParse({ thread, owner });
  if (!result.success) {
    return <h1>Invalid Props</h1>;
  }

  const authUser = useSelector((state) => state.authUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const upActive = !!authUser && thread.upVotesBy.includes(authUser.id);
  const downActive = !!authUser && thread.downVotesBy.includes(authUser.id);

  const handleVote = async (type) => {
    if (!authUser) {
      toast.warning('Anda harus login terlebih dahulu!');
      navigate('/login');
      return;
    }

    let voteType = type;
    if (type === 'up' && upActive) {
      voteType = 'neutral';
    } else if (type === 'down' && downActive) {
      voteType = 'neutral';
    }

    try {
      await dispatch(asyncApplyVoteThread({ threadId: thread.id, voteType }));
    } catch (err) {
      toast.error(err.message);
    }
  };

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
      <div className='mt-3 flex pr-2 items-center justify-between'>
        <VoteButtons
          upCount={thread.upVotesBy.length}
          downCount={thread.downVotesBy.length}
          upActive={upActive}
          downActive={downActive}
          onUp={() => handleVote('up')}
          onDown={() => handleVote('down')}
        />
        <span className='ml-auto flex items-center gap-2'>
          <MessageCircle className='h-4 w-4' />
          {thread.totalComments}
        </span>
      </div>
    </div>
  );
}
