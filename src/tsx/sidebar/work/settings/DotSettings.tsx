import React from 'react';
import { updateDotAngle, updateDotDistance, updateDotRadius } from '../../../state/image/ImageThunks';
import { UUID } from '../../../state/image/ImageTypes';
import CircleSettings from './CircleSettings';

interface DotSettingsProps {
    id: UUID;
}

const DotSettings: React.FunctionComponent<DotSettingsProps> = ({ id }) => {
    return (
        <CircleSettings
            id={id}
            updateRadius={updateDotRadius}
            updateDistance={updateDotDistance}
            updateAngle={updateDotAngle}
        />
    );
};

export default DotSettings;
