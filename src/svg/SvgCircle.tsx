import cn from '@/utils/cn';
import React from 'react';

interface SvgCircleProps extends React.SVGProps<SVGCircleElement> {
    radius: number;
    filled?: boolean;
    isHovered?: boolean;
    isSelected?: boolean;
}

const SvgCircle: React.FC<SvgCircleProps> = ({
    radius,
    filled = false,
    className,
    isHovered = false,
    isSelected = false,
    ...props
}) => {
    return (
        <circle
            cx={0}
            cy={0}
            r={radius}
            className={cn(
                'transition-colors--not-print',
                {
                    'hovered__stroke--not-print': isHovered,
                    'hovered__fill--not-print': isHovered && filled,
                    'selected__stroke--not-print': isSelected,
                    'selected__fill--not-print': isSelected && filled,
                },
                className,
            )}
            {...props}
        />
    );
};

export default React.memo(SvgCircle);
