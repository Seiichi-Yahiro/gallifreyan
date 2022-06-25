import React from 'react';
import { useRedux } from '../../../hooks/useRedux';
import { AppThunkAction } from '../../../state/AppState';
import { UUID } from '../../../state/image/ImageTypes';
import { Degree } from '../../../utils/LinearAlgebra';
import AngleInput from './AngleInput';
import DistanceInput from './DistanceInput';
import RadiusInput from './RadiusInput';

interface CircleSettingsProps {
    id: UUID;
    updateRadius: (id: UUID, r: number) => AppThunkAction;
    updateDistance: (id: UUID, distance: number) => AppThunkAction;
    updateAngle: (id: UUID, angle: Degree) => AppThunkAction;
    disableRadius?: boolean;
    disableDistance?: boolean;
    disableAngle?: boolean;
    relativeAngle?: Degree;
}

const CircleSettings: React.FunctionComponent<CircleSettingsProps> = ({
    id,
    updateRadius,
    updateDistance,
    updateAngle,
    disableRadius,
    disableDistance,
    disableAngle,
    relativeAngle,
}) => {
    const { r, distance, angle } = useRedux((state) => state.image.circles[id]!.circle);

    return (
        <>
            <RadiusInput id={id} radius={r} updateRadius={updateRadius} disabled={disableRadius} />
            <DistanceInput id={id} distance={distance} updateDistance={updateDistance} disabled={disableDistance} />
            <AngleInput
                id={id}
                angle={angle}
                updateAngle={updateAngle}
                disabled={disableAngle}
                relativeAngle={relativeAngle}
            />
        </>
    );
};

export default CircleSettings;
