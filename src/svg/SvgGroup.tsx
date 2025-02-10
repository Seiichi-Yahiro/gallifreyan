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
    isHovered?: boolean;
    isSelected?: boolean;
}

const SvgGroup: React.FC<SvgGroupProps> = ({
    angle,
    distance,
    rotateInParent,
    children,
    className,
    isHovered = false,
    isSelected = false,
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
            className={cn(
                {
                    'hovered--not-print': isHovered,
                    'selected--not-print': isSelected,
                },
                className,
            )}
            style={{
                transform,
            }}
        >
            {children}
        </g>
    );
};

export default React.memo(SvgGroup);
