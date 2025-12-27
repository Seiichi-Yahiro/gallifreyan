import mPolar from '@/math/polar';
import type { Arc } from '@/redux/svg/svgTypes';
import cn from '@/utils/cn';
import React from 'react';

interface SvgArcProps extends React.SVGProps<SVGPathElement> {
    radius: number;
    arcs: Arc[];
    isHovered?: boolean;
    isSelected?: boolean;
}

const SvgArc: React.FC<SvgArcProps> = ({
    radius,
    arcs,
    className,
    isHovered = false,
    isSelected = false,
    ...props
}) => {
    const d = arcs
        .map(({ start, end }) => {
            const startPos = mPolar.toCartesian({
                angle: start,
                distance: radius,
            });
            const endPos = mPolar.toCartesian({ angle: end, distance: radius });

            const isLargeArc = Math.abs(end.value - start.value) > Math.PI;
            const largeArcFlag = !(isLargeArc !== start.value < end.value);

            return `M ${startPos.x} ${-startPos.y} A ${radius} ${radius} 0 ${Number(largeArcFlag)} 0 ${endPos.x} ${-endPos.y}`;
        })
        .join(' ');

    return (
        <path
            d={d}
            className={cn(
                'transition-colors--not-print',
                {
                    'hovered__stroke--not-print': isHovered,
                    'selected__stroke--not-print': isSelected,
                },
                className,
            )}
            {...props}
        />
    );
};

export default SvgArc;
