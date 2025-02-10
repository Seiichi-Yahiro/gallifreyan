import cn from '@/utils/cn';
import React from 'react';

interface SvgCircleProps {
    radius: number;
    filled?: boolean;
    className?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
}

const SvgCircle: React.FC<SvgCircleProps> = ({
    radius,
    filled = false,
    className,
    onMouseEnter,
    onMouseLeave,
    onClick,
}) => {
    return (
        <circle
            cx={0}
            cy={0}
            r={radius}
            fill={filled ? 'inherit' : 'transparent'}
            stroke="inherit"
            className={cn('transition-colors--not-print', className)}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        />
    );
};

export default React.memo(SvgCircle);
