import mAngle, { AngleUnit } from '@/math/angle';
import { resetIdCounters } from '@/redux/ids';
import { type AppStore, setupStore } from '@/redux/store';
import { svgActions } from '@/redux/svg/svg.slice';
import textThunks from '@/redux/text/text.thunks';
import AngleSettings from '@/sidebar/text/settings/AngleSettings';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from 'test/testHelpers';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('AngleSettings', () => {
    let store: AppStore;

    const oneDegreeInRad = 0.0174533;

    beforeEach(() => {
        store = setupStore();
    });

    afterEach(() => {
        cleanup();
        resetIdCounters();
    });

    it('should focus by clicking on label', async () => {
        store.dispatch(textThunks.setText('b'));

        const user = userEvent.setup();

        renderWithProviders(<AngleSettings id="WRD-0" />, store);

        const label = screen.getByText('Angle');
        await user.click(label);

        const slider = screen.getByRole('slider');

        expect(slider).toHaveFocus();
    });

    it('should show value in degrees', () => {
        store.dispatch(textThunks.setText('b'));
        store.dispatch(
            svgActions.setCircle({
                id: 'WRD-0',
                position: { angle: mAngle.radian(Math.PI) },
            }),
        );

        renderWithProviders(<AngleSettings id="WRD-0" />, store);

        const label = screen.getByRole('spinbutton', { name: 'Angle' });
        expect(label).toHaveValue(180);
    });

    it('should increase word angle by 1 degree on keyboard input', async () => {
        store.dispatch(textThunks.setText('b'));
        store.dispatch(
            svgActions.setCircle({
                id: 'WRD-0',
                position: { angle: mAngle.radian(Math.PI) },
            }),
        );

        const user = userEvent.setup();

        renderWithProviders(<AngleSettings id="WRD-0" />, store);

        const slider = screen.getByRole('slider');
        slider.focus();

        await user.keyboard('{ArrowUp}');

        const result = store.getState().svg.circles['WRD-0'].position.angle;

        expect(result.unit).toStrictEqual(AngleUnit.Radian);
        expect(result.value).toBeCloseTo(Math.PI + oneDegreeInRad, 5);
    });

    it('should set word angle on click', async () => {
        store.dispatch(textThunks.setText('b'));
        store.dispatch(
            svgActions.setCircle({
                id: 'WRD-0',
                position: { angle: mAngle.radian(Math.PI) },
            }),
        );

        const user = userEvent.setup();

        renderWithProviders(<AngleSettings id="WRD-0" />, store);

        const slider = screen.getByRole('slider');

        vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            right: 100,
            bottom: 100,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        await user.pointer([
            {
                keys: '[MouseLeft]',
                target: slider,
                coords: { x: 100, y: 50 },
            },
        ]);

        const result = store.getState().svg.circles['WRD-0'].position.angle;

        expect(result.unit).toStrictEqual(AngleUnit.Radian);
        expect(result.value).toBeCloseTo(Math.PI * 0.5, 5);
    });

    it('should increase letter angle by 1 degree on keyboard input', async () => {
        store.dispatch(textThunks.setText('b'));
        store.dispatch(
            svgActions.setCircle({
                id: 'LTR-0',
                position: { angle: mAngle.radian(Math.PI) },
            }),
        );

        const user = userEvent.setup();

        renderWithProviders(<AngleSettings id="LTR-0" />, store);

        const slider = screen.getByRole('slider');
        slider.focus();

        await user.keyboard('{ArrowUp}');

        const result = store.getState().svg.circles['LTR-0'].position.angle;

        expect(result.unit).toStrictEqual(AngleUnit.Radian);
        expect(result.value).toBeCloseTo(Math.PI + oneDegreeInRad, 5);
    });

    it('should set letter angle on click', async () => {
        store.dispatch(textThunks.setText('b'));
        store.dispatch(
            svgActions.setCircle({
                id: 'LTR-0',
                position: { angle: mAngle.radian(Math.PI) },
            }),
        );

        const user = userEvent.setup();

        renderWithProviders(<AngleSettings id="LTR-0" />, store);

        const slider = screen.getByRole('slider');

        vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            right: 100,
            bottom: 100,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        await user.pointer([
            {
                keys: '[MouseLeft]',
                target: slider,
                coords: { x: 100, y: 50 },
            },
        ]);

        const result = store.getState().svg.circles['LTR-0'].position.angle;

        expect(result.unit).toStrictEqual(AngleUnit.Radian);
        expect(result.value).toBeCloseTo(Math.PI * 0.5, 5);
    });

    it('should increase dot angle by 1 degree on keyboard input', async () => {
        store.dispatch(textThunks.setText('ph'));
        store.dispatch(
            svgActions.setCircle({
                id: 'LTR-0',
                position: { angle: mAngle.radian(Math.PI) },
            }),
        );
        store.dispatch(
            svgActions.setCircle({
                id: 'DOT-0',
                position: { angle: mAngle.radian(Math.PI * 0.5) },
            }),
        );

        const user = userEvent.setup();

        renderWithProviders(<AngleSettings id="DOT-0" />, store);

        const slider = screen.getByRole('slider');
        slider.focus();

        await user.keyboard('{ArrowUp}');

        const result = store.getState().svg.circles['DOT-0'].position.angle;

        expect(result.unit).toStrictEqual(AngleUnit.Radian);
        expect(result.value).toBeCloseTo(Math.PI * 0.5 + oneDegreeInRad, 5);
    });

    it('should set dot angle on click with parent angle', async () => {
        store.dispatch(textThunks.setText('ph'));
        store.dispatch(
            svgActions.setCircle({
                id: 'LTR-0',
                position: { angle: mAngle.radian(Math.PI) },
            }),
        );
        store.dispatch(
            svgActions.setCircle({
                id: 'DOT-0',
                position: { angle: mAngle.radian(Math.PI * 0.5) },
            }),
        );

        const user = userEvent.setup();

        renderWithProviders(<AngleSettings id="DOT-0" />, store);

        const slider = screen.getByRole('slider');

        vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            right: 100,
            bottom: 100,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        await user.pointer([
            {
                keys: '[MouseLeft]',
                target: slider,
                coords: { x: 100, y: 50 },
            },
        ]);

        const result = store.getState().svg.circles['DOT-0'].position.angle;

        expect(result.unit).toStrictEqual(AngleUnit.Radian);
        expect(result.value).toBeCloseTo(Math.PI * 1.5, 5);
    });

    it('should increase line slot angle by 1 degree on keyboard input', async () => {
        store.dispatch(textThunks.setText('g'));
        store.dispatch(
            svgActions.setCircle({
                id: 'LTR-0',
                position: { angle: mAngle.radian(Math.PI) },
            }),
        );
        store.dispatch(
            svgActions.setLineSlotPosition({
                id: 'LNS-0',
                position: { angle: mAngle.radian(Math.PI * 0.5) },
            }),
        );

        const user = userEvent.setup();

        renderWithProviders(<AngleSettings id="LNS-0" />, store);

        const slider = screen.getByRole('slider');
        slider.focus();

        await user.keyboard('{ArrowUp}');

        const result = store.getState().svg.lineSlots['LNS-0'].position.angle;

        expect(result.unit).toStrictEqual(AngleUnit.Radian);
        expect(result.value).toBeCloseTo(Math.PI * 0.5 + oneDegreeInRad, 5);
    });

    it('should set line slot angle on click with parent angle', async () => {
        store.dispatch(textThunks.setText('g'));
        store.dispatch(
            svgActions.setCircle({
                id: 'LTR-0',
                position: { angle: mAngle.radian(Math.PI) },
            }),
        );
        store.dispatch(
            svgActions.setLineSlotPosition({
                id: 'LNS-0',
                position: { angle: mAngle.radian(Math.PI * 0.5) },
            }),
        );

        const user = userEvent.setup();

        renderWithProviders(<AngleSettings id="LNS-0" />, store);

        const slider = screen.getByRole('slider');

        vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            right: 100,
            bottom: 100,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        await user.pointer([
            {
                keys: '[MouseLeft]',
                target: slider,
                coords: { x: 100, y: 50 },
            },
        ]);

        const result = store.getState().svg.lineSlots['LNS-0'].position.angle;

        expect(result.unit).toStrictEqual(AngleUnit.Radian);
        expect(result.value).toBeCloseTo(Math.PI * 1.5, 5);
    });
});
