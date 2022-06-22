import React from 'react';
import { updateWordAngle, updateWordDistance, updateWordRadius } from '../../../state/image/ImageThunks';
import { UUID } from '../../../state/image/ImageTypes';
import CircleSettings from './CircleSettings';

interface WordSettingsProps {
    id: UUID;
}

const WordSettings: React.FunctionComponent<WordSettingsProps> = ({ id }) => {
    return (
        <CircleSettings
            id={id}
            updateRadius={updateWordRadius}
            updateDistance={updateWordDistance}
            updateAngle={updateWordAngle}
        />
    );
};

export default WordSettings;
