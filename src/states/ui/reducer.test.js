import { describe, expect, it } from 'vitest';
import uiReducer from './reducer';
import { ActionType } from './action';

describe('uiReducer function', () => {
  it('should return the initial state when given by unknown action', () => {
    // arrange
    const initialState = { loadingCount: 0 };
    const action = { type: 'UNKNOWN' };

    // action
    const nextState = uiReducer(initialState, action);

    // assert
    expect(nextState).toEqual(initialState);
  });

  it('should return the ui loading count > 0 when given by START_LOADING action', () => {
    // arrange
    const initialState = { loadingCount: 0 };
    const action = { type: ActionType.START_LOADING };

    // action
    const nextState = uiReducer(initialState, action);

    // assert
    expect(nextState).toEqual({ loadingCount: 1 });
  });

  it('shouldreturn the ui loading count equal 0 whhen given by FINISH_LOADING action', () => {
    // arrange
    const initialState = { loadingCount: 1 };
    const action = { type: ActionType.FINISH_LOADING };

    // action: finish loading once
    const nextState = uiReducer(initialState, action);

    // assert
    expect(nextState).toEqual({ loadingCount: 0 });

    // action: unexpected finish loading once again
    const nextState2 = uiReducer(nextState, action);

    // assert
    expect(nextState2).toEqual({ loadingCount: 0 });
  });
});
