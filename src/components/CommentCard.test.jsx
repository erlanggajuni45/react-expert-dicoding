import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CommentCard from './CommentCard';
import { configureStore } from '@reduxjs/toolkit';
import matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import { asyncApplyVoteComment } from '../states/threadDetail/action';

expect.extend(matchers);

const mockDispatch = vi.fn();
vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../states/threadDetail/action', () => ({
  asyncApplyVoteComment: vi.fn(),
}));

function renderWithContext(ui, { preloadedState = {}, ...renderOptions } = {}) {
  const store = configureStore({
    reducer: {
      authUser: (state = preloadedState.authUser || null) => state,
    },
  });

  function wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper, ...renderOptions }) };
}

describe('CommentCard component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const comment = {
    id: 'comment-1',
    owner: {
      id: 'user-1',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg',
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    content: 'This is a comment',
    upVotesBy: ['user-2'],
    downVotesBy: [],
  };
  const threadId = 'thread-1';

  const authUser = {
    id: 'user-2',
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatar: 'https://example.com/avatar2.jpg',
  };

  it('should show "Invalid Payload" if props are missing or invalid', () => {
    // arrange
    renderWithContext(<CommentCard commentCount='111' />);

    const heading = screen.getByRole('heading', { name: /Invalid Payload/i });

    // assert
    expect(heading).toBeInTheDocument();
  });

  it('should render comment card', () => {
    // arrange & act
    renderWithContext(
      <CommentCard
        comment={comment}
        threadId={threadId}
      />,
      {
        preloadedState: {
          authUser,
        },
      },
    );

    // assert
    const ownerName = screen.getByText(comment.owner.name);
    const content = screen.getByText(comment.content);
    const upVotes = screen.getByText('1');
    const downVotes = screen.getByText('0');

    expect(ownerName).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(upVotes).toBeInTheDocument();
    expect(downVotes).toBeInTheDocument();
  });

  it('should show login warning and navigate to login page when voting without authentication', async () => {
    // arrange
    const { toast } = await import('sonner');
    toast.warning = vi.fn();

    renderWithContext(
      <CommentCard
        comment={comment}
        threadId={threadId}
      />,
    );

    // act
    const upButton = screen.getByRole('button', { name: '1' });
    await userEvent.click(upButton);

    // assert
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(toast.warning).toHaveBeenCalledWith('Anda harus login terlebih dahulu!');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should dispatch asyncApplyVoteComment with type "up" when upvote button is clicked and user hasn\'t upvoted yet', async () => {
    // arrange
    const commentWithNoVotes = { ...comment, upVotesBy: [], downVotesBy: [] };
    renderWithContext(
      <CommentCard
        comment={commentWithNoVotes}
        threadId={threadId}
      />,
      {
        preloadedState: { authUser },
      },
    );

    // act
    const buttons = screen.getAllByRole('button');
    const upButton = buttons[0];
    await userEvent.click(upButton);

    // assert
    expect(asyncApplyVoteComment).toHaveBeenCalledWith({
      threadId,
      commentId: comment.id,
      voteType: 'up',
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should dispatch asyncApplyVoteComment with type "down" when downvote button is clicked and user hasn\'t downvoted yet', async () => {
    // arrange
    const commentWithNoVotes = { ...comment, upVotesBy: [], downVotesBy: [] };
    renderWithContext(
      <CommentCard
        comment={commentWithNoVotes}
        threadId={threadId}
      />,
      {
        preloadedState: { authUser },
      },
    );

    // act
    const buttons = screen.getAllByRole('button');
    const downButton = buttons[1];
    await userEvent.click(downButton);

    // assert
    expect(asyncApplyVoteComment).toHaveBeenCalledWith({
      threadId,
      commentId: comment.id,
      voteType: 'down',
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should dispatch asyncApplyVoteComment with type "neutral" when user cancels their upvote', async () => {
    // arrange
    renderWithContext(
      <CommentCard
        comment={comment}
        threadId={threadId}
      />,
      {
        preloadedState: { authUser },
      },
    );

    // act
    const buttons = screen.getAllByRole('button');
    const upButton = buttons[0];
    await userEvent.click(upButton);

    // assert
    expect(asyncApplyVoteComment).toHaveBeenCalledWith({
      threadId,
      commentId: comment.id,
      voteType: 'neutral',
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should dispatch asyncApplyVoteComment with type "neutral" when user cancels their downvote', async () => {
    // arrange
    const commentWithDownVote = { ...comment, upVotesBy: [], downVotesBy: ['user-2'] };
    renderWithContext(
      <CommentCard
        comment={commentWithDownVote}
        threadId={threadId}
      />,
      {
        preloadedState: { authUser },
      },
    );

    // act
    const buttons = screen.getAllByRole('button');
    const downButton = buttons[1];
    await userEvent.click(downButton);

    // assert
    expect(asyncApplyVoteComment).toHaveBeenCalledWith({
      threadId,
      commentId: comment.id,
      voteType: 'neutral',
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should show error toast when vote action fails', async () => {
    // arrange
    const { toast } = await import('sonner');
    toast.error = vi.fn();

    const errorMessage = 'Failed to apply vote';
    mockDispatch.mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    renderWithContext(
      <CommentCard
        comment={comment}
        threadId={threadId}
      />,
      {
        preloadedState: { authUser },
      },
    );

    // act
    const buttons = screen.getAllByRole('button');
    const upButton = buttons[0];
    await userEvent.click(upButton);

    // assert
    expect(mockDispatch).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });
});
