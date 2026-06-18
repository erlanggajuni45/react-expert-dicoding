import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import VoteButtons from './VoteButtons';
import matchers from '@testing-library/jest-dom/matchers';
import userEvent from '@testing-library/user-event';

expect.extend(matchers);

describe('VoteButtons component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should show "Invalid payload" if props are missing or invalid', () => {
    // arrange & act
    render(<VoteButtons upCount="invalid" />);

    const heading = screen.getByRole('heading', { name: /Invalid payload/i });

    // assert
    expect(heading).toBeInTheDocument();
  });

  it('should render upvote and downvote counts correctly', () => {
    // arrange & act
    render(
      <VoteButtons
        upCount={10}
        downCount={5}
        upActive={false}
        downActive={false}
        onUp={() => {}}
        onDown={() => {}}
      />,
    );

    // assert
    const upButton = screen.getByRole('button', { name: '10' });
    const downButton = screen.getByRole('button', { name: '5' });

    expect(upButton).toBeInTheDocument();
    expect(downButton).toBeInTheDocument();
  });

  it('should apply active styles to upvote button when upActive is true', () => {
    // arrange & act
    render(
      <VoteButtons
        upCount={1}
        downCount={0}
        upActive={true}
        downActive={false}
        onUp={() => {}}
        onDown={() => {}}
      />,
    );

    const upButton = screen.getByRole('button', { name: '1' });

    // assert
    expect(upButton).toHaveClass('text-emerald-600', 'bg-emerald-50');
  });

  it('should apply active styles to downvote button when downActive is true', () => {
    // arrange & act
    render(
      <VoteButtons
        upCount={0}
        downCount={1}
        upActive={false}
        downActive={true}
        onUp={() => {}}
        onDown={() => {}}
      />,
    );

    const downButton = screen.getByRole('button', { name: '1' });

    // assert
    expect(downButton).toHaveClass('text-rose-600', 'bg-rose-50');
  });

  it('should call onUp and onDown when buttons are clicked', async () => {
    // arrange
    const onUp = vi.fn();
    const onDown = vi.fn();
    render(
      <VoteButtons
        upCount={0}
        downCount={0}
        upActive={false}
        downActive={false}
        onUp={onUp}
        onDown={onDown}
      />,
    );

    const buttons = screen.getAllByRole('button');
    const upButton = buttons[0];
    const downButton = buttons[1];

    // act
    await userEvent.click(upButton);
    await userEvent.click(downButton);

    // assert
    expect(onUp).toHaveBeenCalledTimes(1);
    expect(onDown).toHaveBeenCalledTimes(1);
  });
});
