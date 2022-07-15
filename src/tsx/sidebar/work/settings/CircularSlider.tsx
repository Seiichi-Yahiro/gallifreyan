import { useTheme } from '@mui/material';
import React, { useRef } from 'react';
import { AngleConstraints } from '../../../state/work/WorkTypes';
import { calculateAngle, centerOfDOMRect } from '../../../utils/DragAndDrop';
import { addValue, Degree, Position, rotate, toRadian } from '../../../utils/LinearAlgebra';
import { adjustAngle } from '../../../utils/TextTransforms';
import SliderThumb from './SliderThumb';

interface CircularSliderProps {
    radius: number;
    value: Degree;
    onChange: (newAngle: Degree) => void;
    disabled?: boolean;
    constraints?: AngleConstraints;
    relativeAngle?: Degree;
}

const CircularSlider: React.FunctionComponent<CircularSliderProps> = ({
    radius,
    value,
    onChange,
    disabled = false,
    constraints,
    relativeAngle = 0,
}) => {
    const theme = useTheme();

    const strokeWidth = 4;
    const thumbSize = 20;
    const thumbCenterOffset = thumbSize / 2;
    const size = radius * 2 + thumbSize;
    const circleCenterOffset = size / 2;

    const circleRef = useRef<SVGCircleElement>(null);

    const updateAngle = (event: MouseEvent | React.MouseEvent | Touch) => {
        if (circleRef.current) {
            const mousePos: Position = { x: event.clientX, y: event.clientY };
            const circleCenter = centerOfDOMRect(circleRef.current.getBoundingClientRect());
            const angle: Degree = adjustAngle(calculateAngle(mousePos, circleCenter) - relativeAngle);
            onChange(angle);
        }
    };

    const activeColor = theme.palette.primary.main;
    const disabledColor = theme.palette.grey.A400;
    const currentColor = disabled ? disabledColor : activeColor;
    const cursor = disabled ? 'default' : 'pointer';
    const pointerEvents = disabled ? 'none' : 'auto';
    const opacity = 0.38;

    const thumbPosition = addValue(
        rotate({ x: 0, y: radius }, -toRadian(value + relativeAngle)),
        circleCenterOffset - thumbCenterOffset
    );

    const drawCircleArcs = () => {
        if (!disabled && constraints && !(Math.abs(constraints.maxAngle - constraints.minAngle) >= 360)) {
            const [start, end] = calculateArcPositions(
                0,
                0,
                radius - strokeWidth / 2,
                constraints.minAngle,
                constraints.maxAngle
            );

            return (
                <g style={{ transform: `rotate(-${relativeAngle}deg)` }}>
                    <path
                        d={describeArc(0, 0, radius, constraints.minAngle, constraints.maxAngle)}
                        stroke={currentColor}
                        fill="none"
                        opacity={opacity}
                        strokeWidth={strokeWidth}
                    />
                    <path
                        d={describeArc(0, 0, radius, constraints.maxAngle, constraints.minAngle)}
                        stroke={disabledColor}
                        fill="none"
                        opacity={opacity}
                        strokeWidth={strokeWidth}
                    />
                    <path
                        d={`M ${start.x} ${start.y} L 0 0 L ${end.x} ${end.y}`}
                        stroke={currentColor}
                        strokeWidth={1}
                        opacity={opacity}
                        fill="none"
                    />
                </g>
            );
        } else {
            return (
                <circle
                    r={radius}
                    cx={0}
                    cy={0}
                    strokeWidth={strokeWidth}
                    stroke={currentColor}
                    opacity={opacity}
                    fill="none"
                />
            );
        }
    };

    return (
        <div
            style={{
                position: 'relative',
                padding: 1,
            }}
        >
            <svg width={size} height={size}>
                <g
                    style={{
                        transform: `translate(${circleCenterOffset}px, ${circleCenterOffset}px)`,
                    }}
                >
                    {drawCircleArcs()}
                    <circle
                        ref={circleRef}
                        r={radius}
                        cx={0}
                        cy={0}
                        strokeWidth={strokeWidth * 3}
                        stroke="transparent"
                        fill="none"
                        onClick={disabled ? undefined : updateAngle}
                        style={{ cursor, pointerEvents }}
                    />
                </g>
            </svg>
            <SliderThumb
                disabled={disabled}
                onChange={updateAngle}
                size={thumbSize}
                color={currentColor}
                style={{
                    cursor,
                    pointerEvents,
                    left: thumbPosition.x,
                    top: thumbPosition.y,
                }}
            />
        </div>
    );
};

const calculateArcPositions = (x: number, y: number, radius: number, minAngle: Degree, maxAngle: Degree) => {
    const zeroVec = { x, y: y + radius };

    const start = rotate(zeroVec, -toRadian(minAngle));
    const end = rotate(zeroVec, -toRadian(maxAngle));

    return [start, end];
};

const describeArc = (x: number, y: number, radius: number, minAngle: Degree, maxAngle: Degree): string => {
    const [start, end] = calculateArcPositions(x, y, radius, minAngle, maxAngle);

    const length = Math.abs(maxAngle - minAngle);

    const isLargeArc = length > 180;
    const largeArcFlag = minAngle < maxAngle ? isLargeArc : !isLargeArc;

    const sweep = 0;

    return ['M', start.x, start.y, 'A', radius, radius, 0, Number(largeArcFlag), sweep, end.x, end.y].join(' ');
};

export default CircularSlider;
