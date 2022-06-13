import { useTheme } from '@mui/material';
import React, { useRef, useState } from 'react';
import useEventListener from '../../hooks/useEventListener';
import { calculateAngle, centerOfDOMRect } from '../../utils/DragAndDrop';
import { Degree, Position } from '../../utils/LinearAlgebra';
import { adjustAngle } from '../../utils/TextTransforms';

interface CircularSliderProps {
    radius: number;
    value: Degree;
    onChange: (newAngle: Degree) => void;
}

const CircularSlider: React.FunctionComponent<CircularSliderProps> = ({ radius, value, onChange }) => {
    const theme = useTheme();

    const [isHovered, setHovered] = useState(false);
    const [isDragging, setDragging] = useState(false);

    const strokeWidth = 4;

    const knobSize = 20;
    const knobCenterOffset = knobSize / 2;

    const size = radius * 2 + knobSize;
    const circleCenterOffset = size / 2;

    const circleRef = useRef<SVGCircleElement>(null);

    const target = isDragging ? window : undefined;

    const updateAngle = (event: MouseEvent | React.MouseEvent | Touch) => {
        if (circleRef.current) {
            const mousePos: Position = { x: event.clientX, y: event.clientY };
            const circleCenter = centerOfDOMRect(circleRef.current.getBoundingClientRect());
            const angle: Degree = adjustAngle(calculateAngle(mousePos, circleCenter));
            onChange(angle);
        }
    };

    useEventListener(
        'mousemove',
        (event: MouseEvent) => {
            event.preventDefault();
            updateAngle(event);
        },
        target
    );

    useEventListener(
        'touchmove',
        (event: TouchEvent) => {
            event.preventDefault();
            const touch = event.touches[0];
            updateAngle(touch);
        },
        target
    );

    useEventListener(
        'mouseup touchend',
        () => {
            setDragging(false);
        },
        target
    );

    return (
        <div style={{ position: 'relative', width: size, height: size }}>
            <svg width={size} height={size}>
                <g style={{ transform: `translate(${circleCenterOffset}px, ${circleCenterOffset}px)` }}>
                    <circle
                        ref={circleRef}
                        r={radius}
                        cx={0}
                        cy={0}
                        strokeWidth={strokeWidth}
                        stroke={theme.palette.primary.main}
                        opacity={0.38}
                        fill="none"
                    />
                    <circle
                        r={radius}
                        cx={0}
                        cy={0}
                        strokeWidth={strokeWidth * 3}
                        stroke="transparent"
                        fill="none"
                        onClick={updateAngle}
                        style={{ cursor: 'pointer' }}
                    />
                </g>
            </svg>
            <span
                className="MuiSlider-thumb"
                onMouseOver={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onMouseDown={() => setDragging(true)}
                onTouchStart={() => setDragging(true)}
                style={{
                    width: knobSize,
                    height: knobSize,
                    transform: `rotate(${-value}deg) translateY(${radius}px)`,
                    transformOrigin: 'center',
                    left: circleCenterOffset - knobCenterOffset,
                    top: circleCenterOffset - knobCenterOffset,
                    borderRadius: '50%',
                    position: 'absolute',
                    backgroundColor: theme.palette.primary.main,
                    cursor: 'pointer',
                    boxShadow:
                        isHovered || isDragging
                            ? `0px 0px 0px ${isDragging ? 14 : 8}px rgb(144 202 249 / 16%)`
                            : undefined,
                }}
            ></span>
        </div>
    );
};

export default CircularSlider;
