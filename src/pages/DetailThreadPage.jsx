import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { asyncGetThreadDetail } from '../states/threadDetail/action';
import Skeleton from 'react-loading-skeleton';
import { formatDistanceToNow } from 'date-fns';

export default function DetailThreadPage() {
  const threadDetail = useSelector((state) => state.threadDetail);

  const { threadId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await dispatch(asyncGetThreadDetail(threadId));
      } catch (err) {
        alert(err.message);
        navigate('/');
      }
    })();
  }, [threadId, dispatch, navigate]);

  if (!threadDetail) return <Skeleton count={5} />;

  const { title, body, createdAt, owner, category, comments, upVotesBy, downVotesBy } =
    threadDetail;

  return (
    <div className='px-4 py-8 mx-auto max-w-3xl'>
      <div className='mb-6 bg-white rounded-lg border border-slate-300 p-4 flex flex-col gap-3'>
        <div className='rounded-lg bg-slate-200 mr-auto px-2 py-1 text-xs font-semibold'>
          #{category}
        </div>
        <h3 className='font-semibold text-xl'>{title}</h3>
        <div className='flex gap-2 items-center'>
          <img
            src={owner.avatar}
            alt={owner.name}
            className='rounded-full h-8 w-8'
          />
          <div className='flex flex-col text-sm'>
            <p className='font-normal'>{owner.name}</p>
            <p className='text-black/50'>
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: body }} />
      </div>
    </div>
  );
}
