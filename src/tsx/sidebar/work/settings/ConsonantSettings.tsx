import React from 'react';
import { useRedux } from '../../../hooks/useRedux';
import { updateConsonantAngle, updateConsonantDistance, updateConsonantRadius } from '../../../state/image/ImageThunks';
import { Consonant, ConsonantPlacement, UUID } from '../../../state/image/ImageTypes';
import CircleSettings from './CircleSettings';

interface ConsonantSettingsProps {
    id: UUID;
}

const ConsonantSettings: React.FunctionComponent<ConsonantSettingsProps> = ({ id }) => {
    const placement = useRedux((state) => (state.image.circles[id] as Consonant).placement);

    return (
        <CircleSettings
            id={id}
            updateRadius={updateConsonantRadius}
            updateDistance={updateConsonantDistance}
            updateAngle={updateConsonantAngle}
            disableDistance={placement === ConsonantPlacement.OnLine}
        />
    );
};

export default ConsonantSettings;
