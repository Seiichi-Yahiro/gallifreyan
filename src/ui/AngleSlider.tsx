import mAngle, { type Angle, AngleUnit } from '@/math/angle';
import mVec2 from '@/math/vec';
import { angleFromVec } from '@/redux/svg/svgUtils';
import cn from '@/utils/cn';
import useEventListener from '@/utils/useEventListener';
import React, { useCallback, useRef, useState } from 'react';

interface AngleSliderProps {
    unit: AngleUnit;
    min?: number;
    max?: number;
    value: number;
    step?: number;
    onChange: (value: number) => void;
    className?: string;
}

const AngleSlider: React.FC<AngleSliderProps> = ({
    unit,
    min = 0,
    max = unit === AngleUnit.Degree ? 360 : Math.PI * 2,
    value,
    step,
    onChange,
    className,
}) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const calculateValue = useCallback(
        (clientX: number, clientY: number) => {
            if (!sliderRef.current) {
                return;
            }

            const rect = sliderRef.current.getBoundingClientRect();

            const mousePos = mVec2.create(
                clientX - rect.left - rect.width / 2,
                -(clientY - rect.top - rect.height / 2),
            );

            let angle: Angle = angleFromVec(mousePos);

            if (unit === AngleUnit.Degree) {
                angle = mAngle.toDegree(angle);
            }

            if (step) {
                angle.value = Math.round(angle.value / step) * step;
                angle = mAngle.normalize(angle);
            }

            angle = mAngle.clamp(angle, min, max);

            onChange(angle.value);
        },
        [max, min, onChange, step, unit],
    );

    const onMouseDown = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            sliderRef.current?.focus();
            setIsDragging(true);
            calculateValue(event.clientX, event.clientY);
        },
        [calculateValue],
    );

    const onTouchStart = useCallback(
        (event: React.TouchEvent<HTMLDivElement>) => {
            event.preventDefault();
            sliderRef.current?.focus();
            setIsDragging(true);
            const touch = event.touches[0];
            calculateValue(touch.clientX, touch.clientY);
        },
        [calculateValue],
    );

    const target = isDragging ? window : undefined;

    useEventListener(
        'mousemove',
        (event: MouseEvent) => {
            event.preventDefault();
            calculateValue(event.clientX, event.clientY);
        },
        target,
    );

    useEventListener(
        'touchmove',
        (event: TouchEvent) => {
            event.preventDefault();
            const touch = event.touches[0];
            calculateValue(touch.clientX, touch.clientY);
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
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            const keyStep = step ?? Math.abs(max - min) * 0.1;

            const calculateNextValue = (step: number) => {
                const nextValue = mAngle.clamp(
                    mAngle.normalize({ value: value + step, unit }),
                    min,
                    max,
                ).value;
                onChange(nextValue);
            };

            if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                calculateNextValue(keyStep);
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                calculateNextValue(-keyStep);
            }
        },
        [max, min, onChange, step, unit, value],
    );

    return (
        <div
            ref={sliderRef}
            className={cn(
                'border-border bg-hover-accent outline-accent relative aspect-square w-full cursor-pointer rounded-full border focus:outline-2 focus:-outline-offset-2',
                className,
            )}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            onKeyDown={onKeyDown}
            tabIndex={0}
        >
            <AngleArm
                value={min}
                unit={unit}
                className="bg-hover-accent-strong"
            />
            <AngleArm
                value={max}
                unit={unit}
                className="bg-hover-accent-strong"
            />
            <AngleArm value={value} unit={unit} />
            <div className="bg-text absolute top-[50%] left-[50%] size-1 transform-[translate(-50%,-50%)] rounded-full" />
        </div>
    );
};

interface AngleArmProps {
    value: number;
    unit: AngleUnit;
    className?: string;
}

const AngleArm: React.FC<AngleArmProps> = ({ value, unit, className }) => {
    return (
        <div
            className={cn(
                'bg-text absolute top-[50%] left-[50%] h-[50%] w-[1px] origin-[0_0] transform-[translate(-50%,0)] rounded-b-sm',
                className,
            )}
            style={{
                rotate: -value + unit,
            }}
        />
    );
};

export default React.memo(AngleSlider);
