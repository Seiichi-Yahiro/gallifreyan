import { render, RenderOptions } from '@testing-library/react';
import React, { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { Store, AnyAction } from 'redux';
import { AppStore, configureStore } from '../state/AppStore';

interface WrapperProps {
    children: React.ReactNode;
}

const createWrapper =
    (store: Store<AppStore, AnyAction>): React.FunctionComponent<WrapperProps> =>
    ({ children }) =>
        <Provider store={store}>{children}</Provider>;

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'> & { appStore?: AppStore }) => {
    const store = configureStore();
    return render(ui, { wrapper: createWrapper(store), ...options });
};

export * from '@testing-library/react';
export { customRender as render };
