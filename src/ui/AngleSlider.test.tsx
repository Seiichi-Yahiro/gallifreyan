import { AngleUnit } from '@/math/angle';
import AngleSlider from '@/ui/AngleSlider';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('AngleSlider', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it('renders correct ARIA attributes', () => {
        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={0}
                max={360}
                value={90}
                onChange={vi.fn()}
            />,
        );

        const slider = screen.getByRole('slider');

        expect(slider).toHaveAttribute('aria-valuemin', '0');
        expect(slider).toHaveAttribute('aria-valuemax', '360');
        expect(slider).toHaveAttribute('aria-valuenow', '90');
        expect(slider).toHaveAttribute('aria-valuetext', '90.00 deg');
    });

    it('defaults to max 360 deg', () => {
        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={0}
                value={90}
                onChange={vi.fn()}
            />,
        );

        const slider = screen.getByRole('slider');

        expect(slider).toHaveAttribute('aria-valuemax', '360');
    });

    it('defaults to max 2Pi rad', () => {
        render(
            <AngleSlider
                unit={AngleUnit.Radian}
                min={0}
                value={90}
                onChange={vi.fn()}
            />,
        );

        const slider = screen.getByRole('slider');

        expect(slider).toHaveAttribute(
            'aria-valuemax',
            (Math.PI * 2).toString(),
        );
    });

    it('positions value arm based on value', () => {
        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={0}
                max={360}
                value={90}
                onChange={vi.fn()}
            />,
        );

        const arm = screen.getByTestId('slider-arm-value');
        expect(arm).toHaveStyle({ rotate: '-90deg' });
    });

    it('positions min arm based on min', () => {
        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={10}
                max={360}
                value={90}
                onChange={vi.fn()}
            />,
        );

        const arm = screen.getByTestId('slider-arm-min');
        expect(arm).toHaveStyle({ rotate: '-10deg' });
    });

    it('positions max arm based on max', () => {
        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={0}
                max={360}
                value={90}
                onChange={vi.fn()}
            />,
        );

        const arm = screen.getByTestId('slider-arm-max');
        expect(arm).toHaveStyle({ rotate: '-360deg' });
    });

    it('increments and decrements value with arrow keys', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={0}
                max={360}
                value={90}
                onChange={onChange}
            />,
        );

        const slider = screen.getByRole('slider');
        slider.focus();

        await user.keyboard('{ArrowRight}');
        expect(onChange).toHaveBeenLastCalledWith(126);

        await user.keyboard('{ArrowLeft}');
        expect(onChange).toHaveBeenLastCalledWith(54);

        await user.keyboard('{ArrowUp}');
        expect(onChange).toHaveBeenLastCalledWith(126);

        await user.keyboard('{ArrowDown}');
        expect(onChange).toHaveBeenLastCalledWith(54);
    });

    it('clamps value at max with arrow keys', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={90}
                max={270}
                value={270}
                step={1}
                onChange={onChange}
            />,
        );

        const slider = screen.getByRole('slider');
        slider.focus();

        await user.keyboard('{ArrowRight}');
        expect(onChange).not.toHaveBeenCalled();

        await user.keyboard('{ArrowUp}');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('clamps value at min with arrow keys', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={90}
                max={270}
                value={90}
                step={1}
                onChange={onChange}
            />,
        );

        const slider = screen.getByRole('slider');
        slider.focus();

        await user.keyboard('{ArrowLeft}');
        expect(onChange).not.toHaveBeenCalled();

        await user.keyboard('{ArrowDown}');
        expect(onChange).not.toHaveBeenCalled();
    });

    it('should go from 359 -> 0', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={0}
                max={360}
                value={359}
                step={1}
                onChange={onChange}
            />,
        );

        const slider = screen.getByRole('slider');
        slider.focus();

        await user.keyboard('{ArrowUp}');
        expect(onChange).toHaveBeenLastCalledWith(0);
    });

    it('should go from 0 -> 359', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={0}
                max={360}
                value={0}
                step={1}
                onChange={onChange}
            />,
        );

        const slider = screen.getByRole('slider');
        slider.focus();

        await user.keyboard('{ArrowDown}');
        expect(onChange).toHaveBeenLastCalledWith(359);
    });

    it('uses steps for keyboard interaction when provided', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={0}
                max={360}
                value={90}
                step={10}
                onChange={onChange}
            />,
        );

        const slider = screen.getByRole('slider');
        slider.focus();

        await user.keyboard('{ArrowRight}');
        expect(onChange).toHaveBeenLastCalledWith(100);

        await user.keyboard('{ArrowLeft}');
        expect(onChange).toHaveBeenLastCalledWith(80);

        await user.keyboard('{ArrowUp}');
        expect(onChange).toHaveBeenLastCalledWith(100);

        await user.keyboard('{ArrowDown}');
        expect(onChange).toHaveBeenLastCalledWith(80);
    });

    it('calculates value from pointer position (deg)', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={0}
                max={360}
                value={90}
                onChange={onChange}
            />,
        );

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
                coords: { x: 0, y: 50 },
            },
        ]);

        expect(onChange).toHaveBeenCalledWith(270);
    });

    it('calculates value from pointer position (rad)', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AngleSlider
                unit={AngleUnit.Radian}
                min={0}
                max={Math.PI * 2}
                value={Math.PI * 0.5}
                onChange={onChange}
            />,
        );

        const slider = screen.getByRole('slider');

        vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({
            left: 100,
            top: 0,
            width: 100,
            height: 100,
            right: 200,
            bottom: 100,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        await user.pointer([
            {
                keys: '[MouseLeft]',
                target: slider,
                coords: { x: 0, y: 50 },
            },
        ]);

        expect(onChange).toHaveBeenCalledWith(
            expect.closeTo(Math.PI * 1.5, 0.0001),
        );
    });

    it('snaps pointer value to step', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={0}
                max={360}
                value={90}
                step={10}
                onChange={onChange}
            />,
        );

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
                coords: { x: 0, y: 53 },
            },
        ]);

        expect(onChange).toHaveBeenCalledWith(270);
    });

    it('clamps pointer position to nearest min/max', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={90}
                max={270}
                value={180}
                onChange={onChange}
            />,
        );

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
                coords: { x: 0, y: 55 },
            },
        ]);

        expect(onChange).toHaveBeenCalledWith(270);

        await user.pointer([
            {
                keys: '[MouseLeft]',
                target: slider,
                coords: { x: 100, y: 55 },
            },
        ]);

        expect(onChange).toHaveBeenCalledWith(90);
    });

    it('should rotate the slider when rotation is applied', () => {
        const onChange = vi.fn();

        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={0}
                max={360}
                value={90}
                rotation={90}
                onChange={onChange}
            />,
        );

        const slider = screen.getByRole('slider');
        expect(slider).toHaveStyle({ rotate: '-90deg' });
    });

    it('calculates correct angle from pointer position when rotation is applied', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={0}
                max={360}
                value={90}
                rotation={90}
                onChange={onChange}
            />,
        );

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
                coords: { x: 0, y: 50 },
            },
        ]);

        expect(onChange).toHaveBeenCalledWith(180);
    });

    it('rotation does not affect calculated value from keyboard input', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={0}
                max={360}
                value={90}
                step={1}
                rotation={90}
                onChange={onChange}
            />,
        );

        const slider = screen.getByRole('slider');
        slider.focus();

        await user.keyboard('{ArrowUp}');
        expect(onChange).toHaveBeenLastCalledWith(91);
    });

    it('commits value on pointer up', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={0}
                max={360}
                value={90}
                onChangeCommitted={onChange}
            />,
        );

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
                coords: { x: 0, y: 50 },
            },
        ]);

        expect(onChange).toHaveBeenCalledWith(270);
    });

    it('commits value on key up', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <AngleSlider
                unit={AngleUnit.Degree}
                min={0}
                max={360}
                value={90}
                step={1}
                onChangeCommitted={onChange}
            />,
        );

        const slider = screen.getByRole('slider');
        slider.focus();

        await user.keyboard('{ArrowUp}');
        expect(onChange).toHaveBeenCalledWith(91);

        await user.keyboard('{ArrowDown}');
        expect(onChange).toHaveBeenCalledWith(89);
    });
});
