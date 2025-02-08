import type { Angle } from '@/math/angle';
import { circleTransform } from '@/redux/svg/svgUtils';
import React from 'react';

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
    let transform;

    if (rotateInParent) {
        transform = `rotate(-${angle.value}${angle.unit}) translateY(${distance}px)`;
    } else {
        const pos = circleTransform({ angle, distance });
        transform = `translate(${pos.x}px, ${-pos.y}px)`;
    }

    return (
        <g
            className={className}
            style={{
                transform,
            }}
        >
            {children}
        </g>
    );
};

export default React.memo(SvgGroup);
