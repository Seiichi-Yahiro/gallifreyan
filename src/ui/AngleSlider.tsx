import mAngle, { type Angle, AngleUnit } from '@/math/angle';
import mPolar from '@/math/polar';
import mVec2, { type Vec2 } from '@/math/vec';
import cn from '@/utils/cn';
import useDragAndDrop from '@/utils/useDragAndDrop';
import React, { useRef } from 'react';

interface AngleSliderProps
    extends Omit<
        React.HTMLAttributes<HTMLDivElement>,
        'onChange' | 'onPointerDown'
    > {
    unit: AngleUnit;
    min?: number;
    max?: number;
    value: number;
    step?: number;
    onPointerDown?: () => void;
    onChange: (value: number) => void;
    className?: string;
}

const AngleSlider: React.FC<AngleSliderProps> = ({
    unit,
    min = 0,
    max = unit === AngleUnit.Degree ? 360 : Math.PI * 2,
    value,
    step,
    onPointerDown: externalOnPointerDown,
    onChange,
    className,
    ...props
}) => {
    const sliderRef = useRef<HTMLDivElement>(null);

    const calculateValue = (cursorPos: Vec2) => {
        if (!sliderRef.current) {
            return;
        }

        const rect = sliderRef.current.getBoundingClientRect();

        const mousePos = mVec2.create(
            cursorPos.x - rect.left - rect.width / 2,
            -(cursorPos.y - rect.top - rect.height / 2),
        );

        let angle: Angle = mPolar.angleFromCartesian(mousePos);

        if (unit === AngleUnit.Degree) {
            angle = mAngle.toDegree(angle);
        }

        if (step !== undefined && step > 0) {
            angle.value = Math.round(angle.value / step) * step;
            angle = mAngle.normalize(angle);
        }

        angle = mAngle.clamp(angle, min, max);

        onChange(angle.value);
    };

    const { onPointerDown } = useDragAndDrop({
        onDown: (client) => {
            externalOnPointerDown?.();
            calculateValue(client);
        },
        onMove: ({ client }) => calculateValue(client),
    });

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
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
    };

    return (
        <div
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={`${value.toFixed(2)} ${unit}`}
            ref={sliderRef}
            className={cn(
                'border-border bg-hover-accent outline-accent relative aspect-square w-full cursor-pointer touch-pinch-zoom rounded-full border focus:outline-2 focus:-outline-offset-2',
                className,
            )}
            onPointerDown={onPointerDown}
            onKeyDown={onKeyDown}
            tabIndex={0}
            {...props}
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

export default AngleSlider;
