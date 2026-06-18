import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ThreadCard from './ThreadCard';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import { asyncApplyVoteThread } from '../states/threads/action';
import { toast } from 'sonner';

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

vi.mock('../states/threads/action', () => ({
  asyncApplyVoteThread: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
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

describe('ThreadCard component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  const thread = {
    id: 'thread-1',
    title: 'Thread Title',
    body: '<p>Thread body content</p>',
    category: 'react',
    createdAt: '2024-01-01T00:00:00.000Z',
    ownerId: 'user-1',
    upVotesBy: ['user-2'],
    downVotesBy: [],
    totalComments: 5,
  };

  const owner = {
    id: 'user-1',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
  };

  const authUser = {
    id: 'user-2',
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatar: 'https://example.com/avatar2.jpg',
  };

  it('should show "Invalid Props" if props are missing or invalid', () => {
    // arrange & act
    renderWithContext(<ThreadCard threadCount={5} />);

    const heading = screen.getByRole('heading', { name: /Invalid Props/i });

    // assert
    expect(heading).toBeInTheDocument();
  });

  it('should render thread card correctly', () => {
    // arrange & act
    renderWithContext(
      <ThreadCard
        thread={thread}
        owner={owner}
      />,
      {
        preloadedState: { authUser },
      },
    );

    // assert
    const title = screen.getByRole('heading', { name: thread.title });
    const ownerName = screen.getByText(new RegExp(owner.name));
    const category = screen.getByText(`#${thread.category}`);
    const upVotes = screen.getByText('1');
    const downVotes = screen.getByText('0');
    const totalComments = screen.getByText('5');

    expect(title).toBeInTheDocument();
    expect(ownerName).toBeInTheDocument();
    expect(category).toBeInTheDocument();
    expect(upVotes).toBeInTheDocument();
    expect(downVotes).toBeInTheDocument();
    expect(totalComments).toBeInTheDocument();
  });

  it('should show login warning and navigate to login page when voting without authentication', async () => {
    // arrange
    renderWithContext(
      <ThreadCard
        thread={thread}
        owner={owner}
      />,
    );

    // act
    const buttons = screen.getAllByRole('button');
    const upButton = buttons[0];
    await userEvent.click(upButton);

    // assert
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(toast.warning).toHaveBeenCalledWith('Anda harus login terlebih dahulu!');
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('should dispatch asyncApplyVoteThread with type "up" when upvote button clicked and user hasn\'t upvoted yet', async () => {
    // arrange
    const threadWithNoVotes = { ...thread, upVotesBy: [], downVotesBy: [] };
    renderWithContext(
      <ThreadCard
        thread={threadWithNoVotes}
        owner={owner}
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
    expect(asyncApplyVoteThread).toHaveBeenCalledWith({
      threadId: thread.id,
      voteType: 'up',
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should dispatch asyncApplyVoteThread with type "down" when downvote button clicked and user hasn\'t downvoted yet', async () => {
    // arrange
    const threadWithNoVotes = { ...thread, upVotesBy: [], downVotesBy: [] };
    renderWithContext(
      <ThreadCard
        thread={threadWithNoVotes}
        owner={owner}
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
    expect(asyncApplyVoteThread).toHaveBeenCalledWith({
      threadId: thread.id,
      voteType: 'down',
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should dispatch asyncApplyVoteThread with type "neutral" when user cancels their upvote', async () => {
    // arrange
    renderWithContext(
      <ThreadCard
        thread={thread}
        owner={owner}
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
    expect(asyncApplyVoteThread).toHaveBeenCalledWith({
      threadId: thread.id,
      voteType: 'neutral',
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should dispatch asyncApplyVoteThread with type "neutral" when user cancels their downvote', async () => {
    // arrange
    const threadWithDownVote = { ...thread, upVotesBy: [], downVotesBy: ['user-2'] };
    renderWithContext(
      <ThreadCard
        thread={threadWithDownVote}
        owner={owner}
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
    expect(asyncApplyVoteThread).toHaveBeenCalledWith({
      threadId: thread.id,
      voteType: 'neutral',
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should show error toast when vote action fails', async () => {
    // arrange
    const errorMessage = 'Failed to apply vote';
    mockDispatch.mockImplementationOnce(() => {
      throw new Error(errorMessage);
    });

    renderWithContext(
      <ThreadCard
        thread={thread}
        owner={owner}
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
