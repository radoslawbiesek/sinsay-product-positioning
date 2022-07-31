import * as React from 'react';

type State<T> =
  | { status: 'idle'; data: null; error: false }
  | { status: 'pending'; data: null; error: false }
  | { status: 'resolved'; data: T; error: false }
  | { status: 'rejected'; data: null; error: true };

type Action<T> =
  | { type: 'start' }
  | { type: 'success'; payload: T }
  | { type: 'error' };

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'start':
      return { status: 'pending', data: null, error: false };
    case 'success':
      return { status: 'resolved', data: action.payload, error: false };
    case 'error':
      return { status: 'rejected', data: null, error: true };
  }
}

function useFetch<T, U extends unknown[]>(
  fetcher: (...args: [...U]) => Promise<T>
) {
  const [state, dispatch] = React.useReducer<
    React.Reducer<State<T>, Action<T>>
  >(reducer, {
    status: 'idle',
    data: null,
    error: false,
  });

  const execute = React.useCallback(
    async (...args: [...U]) => {
      dispatch({ type: 'start' });
      try {
        const result = await fetcher(...args);
        dispatch({ type: 'success', payload: result });
      } catch {
        dispatch({ type: 'error' });
      }
    },
    [fetcher]
  );

  return {
    execute,
    state,
  };
}

export default useFetch;
