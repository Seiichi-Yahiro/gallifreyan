import type { Vec2 } from '@/math/vec';
import useDragAndDrop from '@/utils/useDragAndDrop';
import { clamp } from 'es-toolkit';
import React, { useRef } from 'react';

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
    const percent = (value / range) * 100;

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

        onChange(range * factor);
    };

    const { onPointerDown } = useDragAndDrop({
        onDown: calculateValue,
        onMove: ({ client }) => calculateValue(client),
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
            className="border-border bg-hover-accent outline-accent h-4 touch-pinch-zoom rounded-sm border p-0.5 focus:outline-2 focus:-outline-offset-2"
            tabIndex={0}
            onKeyDown={onKeyDown}
        >
            <div
                ref={sliderRef}
                className="relative size-full cursor-pointer"
                onPointerDown={onPointerDown}
            >
                <div
                    className="bg-text absolute h-full w-[1px] transform-[translate(-50%,0)] rounded-sm"
                    style={{ left: `${percent}%` }}
                />
            </div>
        </div>
    );
};

export default Slider;
