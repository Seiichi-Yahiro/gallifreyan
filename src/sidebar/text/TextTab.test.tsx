import { type AppStore, setupStore } from '@/redux/store';
import TextTab from '@/sidebar/text/TextTab';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('TextTab', () => {
    let store: AppStore;

    beforeEach(() => {
        store = setupStore();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        cleanup();
    });

    it('should spawn all text elements in tree', async () => {
        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <TextTab />
            </Provider>,
        );

        const input = screen.getByLabelText('Sentence');
        await user.click(input);

        await user.keyboard('jb kl np');

        expect(screen.getByText('jb kl np')).toBeInTheDocument();
        expect(screen.getByText('jb')).toBeInTheDocument();
        expect(screen.getByText('kl')).toBeInTheDocument();
        expect(screen.getByText('np')).toBeInTheDocument();
        expect(screen.getByText('j')).toBeInTheDocument();
        expect(screen.getByText('b')).toBeInTheDocument();
        expect(screen.getByText('k')).toBeInTheDocument();
        expect(screen.getByText('l')).toBeInTheDocument();
        expect(screen.getByText('n')).toBeInTheDocument();
        expect(screen.getByText('p')).toBeInTheDocument();
        expect(screen.getAllByText('Dot')).toHaveLength(5);
        expect(screen.getAllByText('Line-Slot')).toHaveLength(3);
    });
});
