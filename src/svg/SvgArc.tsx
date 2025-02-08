import type { Arc } from '@/redux/svg/svgTypes';
import { angleFromVec } from '@/redux/svg/svgUtils';
import { isArray } from 'lodash';
import React from 'react';

interface SvgArcProps {
    radius: number;
    arcs: Arc | Arc[];
    className?: string;
}

const toArray = (arcs: Arc | Arc[]): Arc[] =>
    isArray(arcs.at(0)) ? (arcs as Arc[]) : [arcs as Arc];

const SvgArc: React.FC<SvgArcProps> = ({ radius, arcs, className }) => {
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
            stroke="currentColor"
            fill="transparent"
            className={className}
        />
    );
};

export default React.memo(SvgArc);
