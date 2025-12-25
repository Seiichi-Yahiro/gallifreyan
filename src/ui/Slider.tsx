import type { Vec2 } from '@/math/vec';
import useDragAndDrop from '@/utils/useDragAndDrop';
import useUiTransaction from '@/utils/useUiTransaction';
import { clamp } from 'es-toolkit';
import React, { useImperativeHandle, useRef } from 'react';

export type SliderRef = {
    focus: () => void;
};

interface SliderProps
    extends Omit<
        React.HTMLAttributes<HTMLDivElement>,
        'onChange' | 'onPointerDown' | 'onPointerUp'
    > {
    ref?: React.Ref<SliderRef | null>;
    min: number;
    max: number;
    value: number;
    step?: number;
    onChange?: (value: number) => void;
    onChangeCommitted?: (value: number) => void;
}

const increaseArrowKeys = ['ArrowRight', 'ArrowUp'];
const decreaseArrowKeys = ['ArrowLeft', 'ArrowDown'];

const Slider: React.FC<SliderProps> = ({
    ref,
    min,
    max,
    value,
    step,
    onChange,
    onChangeCommitted,
    ...props
}) => {
    const range = max - min;

    const sliderRef = useRef<HTMLDivElement>(null);
    const sliderTrackRef = useRef<HTMLDivElement>(null);

    useImperativeHandle<SliderRef | null, SliderRef | null>(
        ref,
        (): SliderRef | null => {
            if (sliderRef.current === null) {
                return null;
            }

            return {
                focus: () => {
                    sliderRef.current?.focus();
                },
            };
        },
    );

    const { updateTransactionValue, commitTransaction } = useUiTransaction({
        onChange,
        onChangeCommitted,
        value,
    });

    const percent = range === 0 ? 0 : ((value - min) / range) * 100;

    const calculateValue = (cursorPos: Vec2) => {
        if (!sliderTrackRef.current) {
            return;
        }

        const rect = sliderTrackRef.current.getBoundingClientRect();
        const x = cursorPos.x - rect.left;
        let factor = clamp(x / rect.width, 0, 1);

        if (step !== undefined && step > 0) {
            const stepFactor = step / range;
            factor = Math.round(factor / stepFactor) * stepFactor;
        }

        return min + range * factor;
    };

    const { onPointerDown } = useDragAndDrop({
        onDown: (client) => {
            sliderRef.current?.focus();

            const nextValue = calculateValue(client);

            if (nextValue !== undefined) {
                updateTransactionValue(nextValue);
            }
        },
        onMove: ({ client }) => {
            const nextValue = calculateValue(client);

            if (nextValue !== undefined) {
                updateTransactionValue(nextValue);
            }
        },
        onUp: () => {
            commitTransaction();
        },
    });

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const keyStep = step ?? range * 0.1;

        if (increaseArrowKeys.includes(event.key)) {
            const nextValue = Math.min(value + keyStep, max);
            updateTransactionValue(nextValue);
        } else if (decreaseArrowKeys.includes(event.key)) {
            const nextValue = Math.max(min, value - keyStep);
            updateTransactionValue(nextValue);
        }
    };

    const onKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (
            increaseArrowKeys.includes(event.key) ||
            decreaseArrowKeys.includes(event.key)
        ) {
            commitTransaction();
        }
    };

    return (
        <div
            ref={sliderRef}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={value.toFixed(2)}
            aria-orientation="horizontal"
            className="border-border bg-hover-accent outline-accent h-4 touch-pinch-zoom rounded-sm border p-0.5 focus:outline-2 focus:-outline-offset-2"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            {...props}
        >
            <div
                data-testid="slider-track"
                ref={sliderTrackRef}
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
