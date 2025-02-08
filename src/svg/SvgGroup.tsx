import type { Angle } from '@/math/angle';
import { circleTransform } from '@/redux/svg/svgUtils';
import React from 'react';

interface SvgGroupProps {
    angle: Angle;
    distance: number;
    rotateInParent: boolean;
    children: React.ReactNode;
}

const SvgGroup: React.FC<SvgGroupProps> = ({
    angle,
    distance,
    rotateInParent,
    children,
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
            style={{
                transform,
            }}
        >
            {children}
        </g>
    );
};

export default React.memo(SvgGroup);
