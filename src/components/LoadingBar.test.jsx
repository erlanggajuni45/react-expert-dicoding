import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import LoadingBar from './LoadingBar';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

function renderWithContext(ui, { preloadedState = {}, ...renderOptions } = {}) {
  const store = configureStore({
    reducer: {
      ui: (state = preloadedState.ui || { loadingCount: 0 }) => state,
    },
  });

  function wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper, ...renderOptions }) };
}

describe('LoadingBar component', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render nothing when loadingCount is 0', () => {
    // arrange & act
    const { container } = renderWithContext(<LoadingBar />, {
      preloadedState: {
        ui: { loadingCount: 0 },
      },
    });

    // assert
    expect(container).toBeEmptyDOMElement();
  });

  it('should render loading bar when loadingCount is greater than 0', () => {
    // arrange & act
    const { container } = renderWithContext(<LoadingBar />, {
      preloadedState: {
        ui: { loadingCount: 1 },
      },
    });

    // assert
    expect(container).not.toBeEmptyDOMElement();

    const bar = container.firstChild;
    expect(bar).toHaveClass('fixed', 'top-0', 'left-0', 'w-full', 'h-1', 'z-50');
  });
});
