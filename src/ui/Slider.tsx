import useEventListener from '@/utils/useEventListener';
import { clamp } from 'lodash';
import React, {
    type KeyboardEvent,
    useCallback,
    useRef,
    useState,
} from 'react';

const thumbWidth = 1;

interface SliderProps {
    min: number;
    max: number;
    value: number;
    step?: number;
    onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ min, max, value, step, onChange }) => {
    const range = max - min;

    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [percent, setPercent] = useState((value / range) * 100);

    const target = isDragging ? window : undefined;

    const calculateValue = useCallback(
        (clientX: number) => {
            if (!sliderRef.current) {
                return;
            }

            const rect = sliderRef.current.getBoundingClientRect();
            const x = clientX - rect.left;
            let factor = clamp(x / rect.width, 0, 1);

            if (step) {
                const stepFactor = step / range;
                factor = Math.round(factor / stepFactor) * stepFactor;
            }

            setPercent(factor * 100);
            onChange(range * factor);
        },
        [onChange, range, step],
    );

    const onMouseDown = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            sliderRef.current?.parentElement?.focus();
            setIsDragging(true);
            calculateValue(event.clientX);
        },
        [calculateValue],
    );

    const onTouchStart = useCallback(
        (event: React.TouchEvent<HTMLDivElement>) => {
            event.preventDefault();
            sliderRef.current?.parentElement?.focus();
            setIsDragging(true);
            const touch = event.touches[0];
            calculateValue(touch.clientX);
        },
        [calculateValue],
    );

    useEventListener(
        'mousemove',
        (event: MouseEvent) => {
            event.preventDefault();
            calculateValue(event.clientX);
        },
        target,
    );

    useEventListener(
        'touchmove',
        (event: TouchEvent) => {
            event.preventDefault();
            const touch = event.touches[0];
            calculateValue(touch.clientX);
        },
        target,
    );

    useEventListener(
        'mouseup touchend',
        () => {
            setIsDragging(false);
        },
        target,
    );

    const onKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>) => {
            const keyStep = step ?? range * 0.1;

            if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                const nextValue = Math.min(value + keyStep, max);
                setPercent((nextValue / range) * 100);
                onChange(nextValue);
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                const nextValue = Math.max(min, value - keyStep);
                setPercent((nextValue / range) * 100);
                onChange(nextValue);
            }
        },
        [max, min, onChange, range, step, value],
    );

    return (
        <div
            className="border-border bg-hover-accent outline-accent h-4 rounded-sm border p-0.5 focus-visible:outline-2 focus-visible:-outline-offset-2"
            tabIndex={0}
            onKeyDown={onKeyDown}
        >
            <div
                ref={sliderRef}
                className="relative size-full cursor-pointer"
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
            >
                <div
                    className="bg-text absolute h-full rounded-sm"
                    style={{
                        width: thumbWidth,
                        left: `calc(${percent}% - ${thumbWidth / 2}px)`,
                    }}
                />
            </div>
        </div>
    );
};

export default React.memo(Slider);
