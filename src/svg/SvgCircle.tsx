import React from 'react';

interface SvgCircleProps {
    radius: number;
    filled?: boolean;
}

const SvgCircle: React.FC<SvgCircleProps> = ({ radius, filled = false }) => {
    return (
        <circle
            cx={0}
            cy={0}
            r={radius}
            fill={filled ? 'currentColor' : 'transparent'}
            stroke="currentColor"
        />
    );
};

export default React.memo(SvgCircle);
