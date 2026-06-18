import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CommentPost from './CommentPost';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import matchers from '@testing-library/jest-dom/matchers';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';

vi.mock('../states/threadDetail/action', () => ({ asyncAddCommentThread: vi.fn() }));

const mockDispatch = vi.fn();
vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

expect.extend(matchers);

function renderWithContext(ui, { preloadedState = {}, ...renderOptions } = {}) {
  const store = configureStore({
    reducer: {
      authUser: (state = preloadedState.authUser || null) => state,
      ui: (state = preloadedState.ui || { loadingCount: 0 }) => state,
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

const authUser = {
  id: 'john_doe',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://generated-image-url.jpg',
};

describe('CommentPost component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should show "Invalid Payload" if props are missing or invalid', () => {
    // arrange
    renderWithContext(<CommentPost commentCount='111' />);

    const heading = screen.getByRole('heading', { name: /Invalid Payload/i });

    // assert
    expect(heading).toBeInTheDocument();
  });

  it('should show "Login untuk berkomentar" if user is not logged in yet', () => {
    // arrange
    renderWithContext(
      <CommentPost
        threadId='thread-Np47p4jhUXYhrhRn'
        commentCount={1}
      />,
    );

    // action
    const loginLink = screen.getByRole('link', { name: /login/i });
    const textInfo = screen.getByText(/untuk berkomentar/i);

    // assert
    expect(loginLink).toBeInTheDocument();
    expect(textInfo).toBeInTheDocument();
  });

  it('should show textarea and post button when user is logged in', () => {
    // arrange
    renderWithContext(
      <CommentPost
        threadId='thread-Np47p4jhUXYhrhRn'
        commentCount={1}
      />,
      {
        preloadedState: { authUser },
      },
    );

    const commentInput = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /Kirim Komentar/i });

    // assert
    expect(commentInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('should handle comment typing correctly', async () => {
    // arrange
    renderWithContext(
      <CommentPost
        threadId='thread-1'
        commentCount={1}
      />,
      { preloadedState: { authUser } },
    );

    const commentInput = screen.getByRole('textbox');

    // action
    await userEvent.type(commentInput, 'Ini komentar!');

    // assert
    expect(commentInput).toHaveValue('Ini komentar!');
  });

  it('should disable submit button when loadingCount > 0', () => {
    // arrange
    renderWithContext(
      <CommentPost
        threadId='thread-1'
        commentCount={1}
      />,
      { preloadedState: { authUser, ui: { loadingCount: 1 } } },
    );
    const submitButton = screen.getByRole('button', { name: /kirim komentar/i });

    // assert
    expect(submitButton).toBeDisabled();
  });

  it('should dispatch action and clear input when submit button is clicked', async () => {
    // arrange
    const { toast } = await import('sonner');
    toast.success = vi.fn();

    renderWithContext(
      <CommentPost
        threadId='thread-id'
        commentCount={1}
      />,
      { preloadedState: { authUser } },
    );
    const commentInput = screen.getByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /kirim komentar/i });

    // action
    await userEvent.type(commentInput, 'ini komentar');
    await userEvent.click(submitButton);

    // assert
    expect(mockDispatch).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Berhasil menambahkan komentar!');
    expect(commentInput).toHaveValue('');
  });

  it('should show error toast when failed to add comment', async () => {
    // arrange
    const { toast } = await import('sonner');
    toast.error = vi.fn();

    const errorMessage = 'Failed to add comment';
    mockDispatch.mockImplementation(() => {
      throw new Error(errorMessage);
    });

    renderWithContext(
      <CommentPost
        threadId='thread-id'
        commentCount={1}
      />,
      { preloadedState: { authUser } },
    );
    const submitButton = screen.getByRole('button', { name: /kirim komentar/i });

    // action
    await userEvent.click(submitButton);

    // assert
    expect(mockDispatch).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });
});
