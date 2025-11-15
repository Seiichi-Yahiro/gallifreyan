import type { Arc } from '@/redux/svg/svgTypes';
import { angleFromVec } from '@/redux/svg/svgUtils';
import cn from '@/utils/cn';
import { isArray } from 'lodash';
import React from 'react';

interface SvgArcProps extends React.SVGProps<SVGPathElement> {
    radius: number;
    arcs: Arc | Arc[];
    isHovered?: boolean;
    isSelected?: boolean;
}

const toArray = (arcs: Arc | Arc[]): Arc[] =>
    isArray(arcs.at(0)) ? (arcs as Arc[]) : [arcs as Arc];

const SvgArc: React.FC<SvgArcProps> = ({
    radius,
    arcs,
    className,
    isHovered = false,
    isSelected = false,
    ...props
}) => {
    const d = toArray(arcs)
        .map(([start, end]) => {
            const startAngle = angleFromVec(start).value;
            const endAngle = angleFromVec(end).value;

            const isLargeArc = Math.abs(endAngle - startAngle) > Math.PI;
            const largeArcFlag = !(isLargeArc !== startAngle < endAngle);

            return `M ${start.x} ${-start.y} A ${radius} ${radius} 0 ${Number(largeArcFlag)} 0 ${end.x} ${-end.y}`;
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
