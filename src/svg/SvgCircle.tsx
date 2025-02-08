import React from 'react';

interface SvgCircleProps {
    radius: number;
    filled?: boolean;
    className?: string;
}

const SvgCircle: React.FC<SvgCircleProps> = ({
    radius,
    filled = false,
    className,
}) => {
    return (
        <circle
            cx={0}
            cy={0}
            r={radius}
            fill={filled ? 'currentColor' : 'transparent'}
            stroke="currentColor"
            className={className}
        />
    );
};

export default React.memo(SvgCircle);
