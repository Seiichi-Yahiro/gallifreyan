import { configureStore, Store } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { AppState, reducer } from '../state/AppState';

export const createTestStore = (preloadedState?: Partial<AppState>) => configureStore({ reducer, preloadedState });

interface WrapperProps {
    children: React.ReactNode;
}

const createWrapper =
    (store: Store<AppState>): React.FunctionComponent<WrapperProps> =>
    ({ children }) =>
        <Provider store={store}>{children}</Provider>;

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'> & { preloadedState?: Partial<AppState> }
) => {
    const store = createTestStore(options?.preloadedState);
    return render(ui, { wrapper: createWrapper(store), ...options });
};

export * from '@testing-library/react';
export { customRender as render };
