import { type AppStore, setupStore } from '@/redux/store';
import { render } from '@testing-library/react';
import type { FC, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { vi } from 'vitest';

export const renderWithProviders = (
    ui: ReactNode,
    store: AppStore = setupStore(),
) => {
    const wrapper: FC<{ children: ReactNode }> = ({ children }) => {
        return <Provider store={store}>{children}</Provider>;
    };

    return render(ui, { wrapper });
};

export const spyOnAction = <
    T extends {
        [key in keyof T]: { type: string; match: (action: unknown) => boolean };
    },
>(
    actions: T,
    action: keyof T,
) => {
    const t = actions[action].type;
    const match = actions[action].match;
    // @ts-expect-error vitest doesn't like the type of action I don't know why
    const spy = vi.spyOn(actions, action);
    actions[action].type = t;
    actions[action].match = match;
    return spy;
};
