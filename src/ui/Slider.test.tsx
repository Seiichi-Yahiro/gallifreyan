import Slider from '@/ui/Slider';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('Slider', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it('renders correct ARIA attributes', () => {
        render(<Slider min={0} max={100} value={25} onChange={vi.fn()} />);

        const slider = screen.getByRole('slider');

        expect(slider).toHaveAttribute('aria-valuemin', '0');
        expect(slider).toHaveAttribute('aria-valuemax', '100');
        expect(slider).toHaveAttribute('aria-valuenow', '25');
        expect(slider).toHaveAttribute('aria-valuetext', '25.00');
    });

    it('positions indicator based on value percentage', () => {
        render(<Slider min={10} max={110} value={60} onChange={vi.fn()} />);

        const indicator = screen.getByTestId('slider-value-indicator');

        expect(indicator).toHaveStyle({ left: '50%' });
    });

    it('increments and decrements value with arrow keys', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Slider min={0} max={100} value={50} onChange={onChange} />);

        const slider = screen.getByRole('slider');
        slider.focus();

        await user.keyboard('{ArrowRight}');
        expect(onChange).toHaveBeenLastCalledWith(60);

        await user.keyboard('{ArrowLeft}');
        expect(onChange).toHaveBeenLastCalledWith(40);

        await user.keyboard('{ArrowUp}');
        expect(onChange).toHaveBeenLastCalledWith(60);

        await user.keyboard('{ArrowDown}');
        expect(onChange).toHaveBeenLastCalledWith(40);
    });

    it('uses step for keyboard interaction when provided', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <Slider
                min={0}
                max={100}
                value={50}
                step={5}
                onChange={onChange}
            />,
        );

        const slider = screen.getByRole('slider');
        slider.focus();

        await user.keyboard('{ArrowRight}');
        expect(onChange).toHaveBeenLastCalledWith(55);

        await user.keyboard('{ArrowLeft}');
        expect(onChange).toHaveBeenLastCalledWith(45);

        await user.keyboard('{ArrowUp}');
        expect(onChange).toHaveBeenLastCalledWith(55);

        await user.keyboard('{ArrowDown}');
        expect(onChange).toHaveBeenLastCalledWith(45);
    });

    it('calculates value from pointer position', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(<Slider min={0} max={100} value={0} onChange={onChange} />);

        const track = screen.getByTestId('slider-track');

        vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            width: 100,
            height: 10,
            right: 100,
            bottom: 10,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        await user.pointer([
            {
                keys: '[MouseLeft]',
                target: track,
                coords: { x: 25, y: 0 },
            },
        ]);

        expect(onChange).toHaveBeenCalledWith(25);
    });

    it('snaps pointer value to step', async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <Slider
                min={0}
                max={100}
                value={0}
                step={10}
                onChange={onChange}
            />,
        );

        const track = screen.getByTestId('slider-track');

        vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
            left: 0,
            top: 0,
            width: 100,
            height: 10,
            right: 100,
            bottom: 10,
            x: 0,
            y: 0,
            toJSON: () => {},
        });

        await user.pointer([
            {
                keys: '[MouseLeft]',
                target: track,
                coords: { x: 26, y: 0 },
            },
        ]);

        expect(onChange).toHaveBeenCalledWith(expect.closeTo(30, 0.0001));
    });
});
