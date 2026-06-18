import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Navbar from './Navbar';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';
import { asyncUnsetAuthUser } from '../states/authUser/action';
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

vi.mock('../states/authUser/action', () => ({
  asyncUnsetAuthUser: vi.fn(),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
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

describe('Navbar component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  const authUser = {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  it('should render brand and navigation links correctly', () => {
    // arrange & act
    renderWithContext(<Navbar />);

    // assert
    const brandLink = screen.getByRole('link', { name: /diskusi/i });
    const leaderboardLink = screen.getByRole('link', { name: /leaderboard/i });

    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute('href', '/');
    expect(leaderboardLink).toBeInTheDocument();
    expect(leaderboardLink).toHaveAttribute('href', '/leaderboard');
  });

  it('should render login button when user is not authenticated', () => {
    // arrange & act
    renderWithContext(<Navbar />, {
      preloadedState: {
        authUser: null,
      },
    });

    // assert
    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');

    expect(screen.queryByRole('button', { name: /thread baru/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should render new thread button, avatar, and logout button when user is authenticated', () => {
    // arrange & act
    renderWithContext(<Navbar />, {
      preloadedState: {
        authUser,
      },
    });

    // assert
    const newThreadLink = screen.getByRole('link', { name: /thread baru/i });
    const avatarImg = screen.getByRole('img', { name: authUser.name });
    const buttons = screen.getAllByRole('button');
    const logoutButton = buttons[1]; // logout button is the second button

    expect(newThreadLink).toBeInTheDocument();
    expect(newThreadLink).toHaveAttribute('href', '/threads/new');
    expect(avatarImg).toBeInTheDocument();
    expect(avatarImg).toHaveAttribute('src', authUser.avatar);
    expect(logoutButton).toBeInTheDocument();

    expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
  });

  it('should call dispatch(asyncUnsetAuthUser()) and show success toast when logout button is clicked', async () => {
    // arrange
    renderWithContext(<Navbar />, {
      preloadedState: {
        authUser,
      },
    });

    const buttons = screen.getAllByRole('button');
    const logoutButton = buttons[1];

    // act
    await userEvent.click(logoutButton);

    // assert
    expect(asyncUnsetAuthUser).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Berhasil logout!');
  });
});
