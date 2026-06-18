import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CategoryFilter from './CategoryFilter';
import matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';

expect.extend(matchers);

describe('CategoryFilter component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should show "Invalid Payload" if props are missing or invalid', () => {
    // arrange
    render(<CategoryFilter />);

    const heading = screen.getByRole('heading', { name: /Invalid Payload/i });

    // assert
    expect(heading).toBeInTheDocument();
  });

  it('should render categories', async () => {
    // arrange
    const categories = ['react', 'javascript', 'css'];
    const onSelected = vi.fn();
    render(
      <CategoryFilter
        categories={categories}
        selected={null}
        onSelected={onSelected}
      />,
    );

    // assert
    const allButton = screen.getByRole('button', { name: /semua/i });
    expect(allButton).toBeInTheDocument();
    expect(allButton).toHaveClass('bg-indigo-600');

    categories.forEach((category) => {
      const button = screen.getByRole('button', { name: `#${category}` });
      expect(button).toBeInTheDocument();
      expect(button).not.toHaveClass('bg-indigo-600');
    });

    // act
  });

  it('should call onSelected when category button is clicked', async () => {
    // arrange
    const categories = ['react', 'javascript', 'css'];
    const onSelected = vi.fn();
    render(
      <CategoryFilter
        categories={categories}
        selected={null}
        onSelected={onSelected}
      />,
    );

    // act
    const jsButton = screen.getByRole('button', { name: /#javascript/i });
    await userEvent.click(jsButton);

    // assert
    expect(onSelected).toHaveBeenCalledWith('javascript');
  });

  it('should highlight selected category', () => {
    // arrange
    const categories = ['react', 'javascript', 'css'];
    render(
      <CategoryFilter
        categories={categories}
        selected={'javascript'}
        onSelected={() => {}}
      />,
    );

    // assert
    const jsButton = screen.getByRole('button', { name: /#javascript/i });
    expect(jsButton).toHaveClass('bg-indigo-600');

    ['#react', '#css', 'semua'].forEach((name) => {
      const button = screen.getByRole('button', { name: new RegExp(name, 'i') });
      expect(button).not.toHaveClass('bg-indigo-600');
    });
  });
});
