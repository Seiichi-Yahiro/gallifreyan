import { type AppStore, setupStore } from '@/redux/store';
import textThunks from '@/redux/thunks/textThunks';
import { convertSvgHtmlElementToString } from '@/sidebar/export/svgExport';
import Svg from '@/svg/Svg';
import { cleanup, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('svg export', async () => {
    let store: AppStore;

    const styleString = await vi.hoisted(async () => {
        const fs = await import('fs');
        const path = await import('path');
        return fs.readFileSync(path.resolve(__dirname, './style.css'), 'utf-8');
    });

    beforeEach(() => {
        store = setupStore();

        vi.mock('./style.css?raw', () => ({
            default: styleString,
        }));
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.resetAllMocks();
        cleanup();
    });

    const snapshotTest = async (text: string) => {
        store.dispatch(textThunks.setText(text));

        const { container } = render(
            <Provider store={store}>
                <Svg />
            </Provider>,
        );

        const svgElement = container.querySelector(
            '#gallifreyan',
        ) as HTMLElement;

        const result = convertSvgHtmlElementToString(svgElement);

        await expect(result).toMatchFileSnapshot(`./__snapshots__/${text}.svg`);
    };

    it('should render bjtth', async () => {
        await snapshotTest('bjtth');
    });

    it('should render phwhgh', async () => {
        await snapshotTest('phwhgh');
    });

    it('should render chkshy', async () => {
        await snapshotTest('chkshy');
    });

    it('should render dlrz', async () => {
        await snapshotTest('dlrz');
    });

    it('should render ndcntq', async () => {
        await snapshotTest('ndcntq');
    });

    it('should render gnvqu', async () => {
        await snapshotTest('gnvqu');
    });

    it('should render hpwx', async () => {
        await snapshotTest('hpwx');
    });

    it('should render fmsng', async () => {
        await snapshotTest('fmsng');
    });

    it('should render aeiou', async () => {
        await snapshotTest('aeiou');
    });
});
