import { useRedux } from '@/redux/hooks';
import type { CircleId } from '@/redux/svg/svgTypes';
import { isDotId, isLineSlotId, type LineSlotId } from '@/redux/text/ids';
import AngleSettings from '@/sidebar/settings/AngleSettings';
import DistanceSettings from '@/sidebar/settings/DistanceSettings';
import RadiusSettings from '@/sidebar/settings/RadiusSettings';
import cn from '@/utils/cn';
import React from 'react';

interface PositionInputProps {
    className?: string;
}

const ElementSettings: React.FC<PositionInputProps> = ({ className }) => {
    const selected = useRedux((state) => state.main.selected);

    if (!selected) {
        return null;
    }

    return (
        <div className={cn('flex flex-col gap-1', className)}>
            {isLineSlotId(selected) ? (
                <LineSlotSettings id={selected} />
            ) : (
                <CircleSettings id={selected} />
            )}
        </div>
    );
};

interface CircleSettingsProps {
    id: CircleId;
}

const CircleSettings: React.FC<CircleSettingsProps> = ({ id }) => {
    const circle = useRedux((state) => state.main.svg.circles[id]);

    const parentAngle = useRedux((state) =>
        isDotId(id)
            ? state.main.svg.circles[state.main.text.elements[id].parent]
                  .position.angle
            : undefined,
    );

    return (
        <>
            <RadiusSettings radius={circle.radius} />
            <DistanceSettings distance={circle.position.distance} />
            <AngleSettings
                angle={circle.position.angle}
                parentAngle={parentAngle}
            />
        </>
    );
};

interface LineSlotSettingsProps {
    id: LineSlotId;
}

const LineSlotSettings: React.FC<LineSlotSettingsProps> = ({ id }) => {
    const lineSlot = useRedux((state) => state.main.svg.lineSlots[id]);

    const parentAngle = useRedux(
        (state) =>
            state.main.svg.circles[state.main.text.elements[id].parent].position
                .angle,
    );

    return (
        <AngleSettings
            angle={lineSlot.position.angle}
            parentAngle={parentAngle}
        />
    );
};

export default React.memo(ElementSettings);
