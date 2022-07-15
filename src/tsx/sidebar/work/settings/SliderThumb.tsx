import React, { useState } from 'react';
import useEventListener from '../../../hooks/useEventListener';

interface SliderThumbProps {
    disabled: boolean;
    onChange: (event: MouseEvent | Touch) => void;
    size: number;
    color: string;
    style?: React.CSSProperties;
}

const SliderThumb: React.FunctionComponent<SliderThumbProps> = ({ disabled, onChange, size, color, style }) => {
    const [isHovered, setHovered] = useState(false);
    const [isDragging, setDragging] = useState(false);

    const target = !disabled && isDragging ? window : undefined;

    useEventListener(
        'mousemove',
        (event: MouseEvent) => {
            event.preventDefault();
            onChange(event);
        },
        target
    );

    useEventListener(
        'touchmove',
        (event: TouchEvent) => {
            event.preventDefault();
            const touch = event.touches[0];
            onChange(touch);
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
        <span
            className="MuiSlider-thumb MuiSlider-thumb--custom"
            onMouseOver={disabled ? undefined : () => setHovered(true)}
            onMouseLeave={disabled ? undefined : () => setHovered(false)}
            onMouseDown={disabled ? undefined : () => setDragging(true)}
            onTouchStart={disabled ? undefined : () => setDragging(true)}
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                position: 'absolute',
                backgroundColor: color,
                boxShadow:
                    isHovered || isDragging ? `0px 0px 0px ${isDragging ? 14 : 8}px rgb(144 202 249 / 16%)` : undefined,
                ...style,
            }}
        />
    );
};

export default SliderThumb;
