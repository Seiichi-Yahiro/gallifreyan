import type { Vec2 } from '@/math/vec';
import useDragAndDrop from '@/utils/useDragAndDrop';
import { clamp } from 'es-toolkit';
import React, { useRef } from 'react';

interface SliderProps
    extends Omit<
        React.HTMLAttributes<HTMLDivElement>,
        'onChange' | 'onPointerDown' | 'onPointerUp'
    > {
    min: number;
    max: number;
    value: number;
    step?: number;
    onPointerDown?: () => void;
    onPointerUp?: () => void;
    onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
    min,
    max,
    value,
    step,
    onPointerDown: externalOnPointerDown,
    onPointerUp: externalOnPointerUp,
    onChange,
    ...props
}) => {
    const range = max - min;

    const sliderRef = useRef<HTMLDivElement>(null);
    const percent = range === 0 ? 0 : ((value - min) / range) * 100;

    const calculateValue = (cursorPos: Vec2) => {
        if (!sliderRef.current) {
            return;
        }

        const rect = sliderRef.current.getBoundingClientRect();
        const x = cursorPos.x - rect.left;
        let factor = clamp(x / rect.width, 0, 1);

        if (step !== undefined && step > 0) {
            const stepFactor = step / range;
            factor = Math.round(factor / stepFactor) * stepFactor;
        }

        onChange(min + range * factor);
    };

    const { onPointerDown } = useDragAndDrop({
        onDown: (client) => {
            externalOnPointerDown?.();
            calculateValue(client);
        },
        onMove: ({ client }) => calculateValue(client),
        onUp: externalOnPointerUp,
    });

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const keyStep = step ?? range * 0.1;

        if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            const nextValue = Math.min(value + keyStep, max);
            onChange(nextValue);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            const nextValue = Math.max(min, value - keyStep);
            onChange(nextValue);
        }
    };

    return (
        <div
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={value.toFixed(2)}
            aria-orientation="horizontal"
            className="border-border bg-hover-accent outline-accent h-4 touch-pinch-zoom rounded-sm border p-0.5 focus:outline-2 focus:-outline-offset-2"
            tabIndex={0}
            onKeyDown={onKeyDown}
            {...props}
        >
            <div
                data-testid="slider-track"
                ref={sliderRef}
                className="relative size-full cursor-pointer"
                onPointerDown={onPointerDown}
            >
                <div
                    data-testid="slider-value-indicator"
                    className="bg-text absolute h-full w-[1px] transform-[translate(-50%,0)] rounded-sm"
                    style={{ left: `${percent}%` }}
                />
            </div>
        </div>
    );
};

export default Slider;
