/* eslint-disable react/prop-types */

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import z from 'zod';
import useInput from '../hooks/useInput';
import { asyncAddCommentThread } from '../states/threadDetail/action';

const CommentPostSchema = z.object({
  threadId: z.string(),
  commentCount: z.number(),
});

export default function CommentPost({ threadId, commentCount }) {
  const result = CommentPostSchema.safeParse({ threadId, commentCount });

  if (!result.success) return <h1>Invalid Payload</h1>;

  const [content, onContentChange, setContent] = useInput('');

  const authUser = useSelector((state) => state.authUser);
  const isLoading = useSelector((state) => state.ui?.loadingCount > 0);
  const dispatch = useDispatch();

  const addComment = async () => {
    try {
      await dispatch(asyncAddCommentThread({ threadId, content }));
      alert('Berhasil menambahkan komentar!');
      setContent('');
    } catch (err) {
      alert(err.message);
    }
  };

  return authUser ? (
    <div className='flex flex-col gap-3 mb-6'>
      <h1>Komentar ({commentCount})</h1>
      <textarea
        className='w-full resize-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
        placeholder='Tulis komentarmu...'
        value={content}
        onChange={onContentChange}
      />
      <button
        type='button'
        className='bg-black text-white rounded-md px-3 py-1 mr-auto disabled:bg-gray-500'
        onClick={addComment}
        disabled={isLoading}
      >
        Kirim Komentar
      </button>
    </div>
  ) : (
    <div className='border border-gray-200 mb-6 flex justify-center mx-auto gap-4 py-8 rounded-xl'>
      <Link
        to='/login'
        className='underline font-semibold'
      >
        Login
      </Link>{' '}
      <span className='text-zinc-500'>untuk berkomentar</span>
    </div>
  );
}
