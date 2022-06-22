import React from 'react';
import { updateSentenceAngle, updateSentenceDistance, updateSentenceRadius } from '../../../state/image/ImageThunks';
import { UUID } from '../../../state/image/ImageTypes';
import CircleSettings from './CircleSettings';

interface SentenceSettingsProps {
    id: UUID;
}

const SentenceSettings: React.FunctionComponent<SentenceSettingsProps> = ({ id }) => {
    return (
        <CircleSettings
            id={id}
            updateRadius={updateSentenceRadius}
            updateDistance={updateSentenceDistance}
            updateAngle={updateSentenceAngle}
        />
    );
};

export default SentenceSettings;
