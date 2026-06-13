/* eslint-disable react/prop-types */

import { formatDistanceToNow } from 'date-fns';
import React from 'react';
import { CommentSchema } from '../schemas';
import VoteButtons from './VoteButtons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { asyncApplyVoteComment } from '../states/threadDetail/action';

export default function CommentCard({ comment, threadId }) {
  const authUser = useSelector((state) => state.authUser);

  const result = CommentSchema.safeParse({ comment, threadId });

  if (!result.success) return <h1>Invalid Payload</h1>;

  const { id: commentId, owner, createdAt, content, upVotesBy, downVotesBy } = comment;

  const upActive = !!authUser && upVotesBy.includes(authUser.id);
  const downActive = !!authUser && downVotesBy.includes(authUser.id);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleVote = async (type) => {
    if (!authUser) {
      alert('Anda harus login terlebih dahulu!');
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
      await dispatch(asyncApplyVoteComment({ threadId, commentId, voteType }));
    } catch (err) {
      alert(err.message);
    }
  };

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
      <VoteButtons
        upCount={upVotesBy.length}
        downCount={downVotesBy.length}
        upActive={upActive}
        downActive={downActive}
        onUp={() => handleVote('up')}
        onDown={() => handleVote('down')}
      />
    </div>
  );
}
