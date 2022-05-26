import { Store } from '@reduxjs/toolkit';
import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { AppState, createStore } from '../state/AppState';

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
    const store = createStore(options?.preloadedState);
    return render(ui, { wrapper: createWrapper(store), ...options });
};

export * from '@testing-library/react';
export { customRender as render };
