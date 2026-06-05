import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TalkDetail from '../components/TalkDetail';
import TalkItem from '../components/TalkItem';
import TalkReplyInput from '../components/TalkReplyInput';
import { useDispatch, useSelector } from 'react-redux';
import { asyncReceiveTalkDetail, asyncToggleLikeTalkDetail } from '../states/talkDetail/action';
import { asyncAddTalk } from '../states/talks/action';

function DetailPage() {
  const { id } = useParams();
  const { talkDetail = null, authUser } = useSelector((states) => states);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncReceiveTalkDetail(id));
  }, [id, dispatch]);

  const onLikeTalk = () => {
    dispatch(asyncToggleLikeTalkDetail());
  };

  const onReplyTalk = (text) => {
    dispatch(asyncAddTalk({ text, replyTo: id }));
  };

  if (!talkDetail) {
    return null;
  }

  return (
    <section className='detail-page'>
      {talkDetail.parent && (
        <div className='detail-page__parent'>
          <h3>Replying To</h3>
          <TalkItem
            {...talkDetail.parent}
            authUser={authUser.id}
          />
        </div>
      )}
      <TalkDetail
        {...talkDetail}
        authUser={authUser.id}
        likeTalk={onLikeTalk}
      />
      <TalkReplyInput replyTalk={onReplyTalk} />
    </section>
  );
}

export default DetailPage;
