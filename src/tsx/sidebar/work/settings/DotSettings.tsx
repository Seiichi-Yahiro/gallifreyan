import React from 'react';
import { useRedux } from '../../../hooks/useRedux';
import { updateDotAngle, updateDotDistance, updateDotRadius } from '../../../state/image/ImageThunks';
import { Dot, UUID } from '../../../state/image/ImageTypes';
import CircleSettings from './CircleSettings';

interface DotSettingsProps {
    id: UUID;
}

const DotSettings: React.FunctionComponent<DotSettingsProps> = ({ id }) => {
    const relativeAngle = useRedux((state) => {
        const dot = state.image.circles[id] as Dot;
        return state.image.circles[dot.parentId]!.circle.angle;
    });

    return (
        <CircleSettings
            id={id}
            updateRadius={updateDotRadius}
            updateDistance={updateDotDistance}
            updateAngle={updateDotAngle}
            relativeAngle={relativeAngle}
        />
    );
};

export default DotSettings;
