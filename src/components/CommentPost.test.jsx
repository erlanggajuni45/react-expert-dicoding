import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import CommentPost from './CommentPost';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import matchers from '@testing-library/jest-dom/matchers';
import { configureStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';

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

describe('CommentPost component', () => {
  afterEach(() => {
    cleanup();
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

  it('should show textarea and post button when user is logged in', async () => {
    // arrange
    renderWithContext(
      <CommentPost
        threadId='thread-Np47p4jhUXYhrhRn'
        commentCount={1}
      />,
      {
        preloadedState: {
          authUser: {
            id: 'john_doe',
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://generated-image-url.jpg',
          },
        },
      },
    );

    const commentInput = screen.getByRole('textbox');

    // action
    await userEvent.type(commentInput, 'Halo, ini komentar!');

    // assert
    expect(commentInput).toHaveValue('Halo, ini komentar!');
  });

  it('should show "Invalid Payload" when the component is given by incorrect argument', () => {
    // arrange
    renderWithContext(
      <CommentPost
        threadId='thread-1'
        commentCount='111'
      />,
    );
    const text = screen.getByText(/Invalid Payload/i);

    // assert
    expect(text).toBeInTheDocument();
  });
});
