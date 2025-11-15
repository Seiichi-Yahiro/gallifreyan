import type { Angle } from '@/math/angle';
import { circleTransform } from '@/redux/svg/svgUtils';
import cn from '@/utils/cn';
import React, { useMemo } from 'react';

interface SvgGroupProps {
    angle: Angle;
    distance: number;
    rotateInParent: boolean;
    className?: string;
    children: React.ReactNode;
}

const SvgGroup: React.FC<SvgGroupProps> = ({
    angle,
    distance,
    rotateInParent,
    children,
    className,
}) => {
    const transform = useMemo(() => {
        if (rotateInParent) {
            return `rotate(-${angle.value}${angle.unit}) translateY(${distance}px)`;
        } else {
            const pos = circleTransform({ angle, distance });
            return `translate(${pos.x}px, ${-pos.y}px)`;
        }
    }, [angle, distance, rotateInParent]);

    return (
        <g
            className={cn(className)}
            style={{
                transform,
            }}
        >
            {children}
        </g>
    );
};

export default SvgGroup;
