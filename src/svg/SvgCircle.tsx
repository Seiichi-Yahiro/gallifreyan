import cn from '@/utils/cn';
import React from 'react';

interface SvgCircleProps extends React.SVGProps<SVGCircleElement> {
    radius: number;
    filled?: boolean;
}

const SvgCircle: React.FC<SvgCircleProps> = ({
    radius,
    filled = false,
    className,
    ...props
}) => {
    return (
        <circle
            cx={0}
            cy={0}
            r={radius}
            fill={filled ? 'inherit' : 'transparent'}
            stroke="inherit"
            className={cn('transition-colors--not-print', className)}
            {...props}
        />
    );
};

export default React.memo(SvgCircle);
