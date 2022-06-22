import React from 'react';
import { useRedux } from '../../../hooks/useRedux';
import { updateVocalAngle, updateVocalDistance, updateVocalRadius } from '../../../state/image/ImageThunks';
import {
    Consonant,
    ConsonantPlacement,
    ImageType,
    UUID,
    Vocal,
    VocalPlacement,
    Word,
} from '../../../state/image/ImageTypes';
import CircleSettings from './CircleSettings';

interface VocalSettingsProps {
    id: UUID;
}

const VocalSettings: React.FunctionComponent<VocalSettingsProps> = ({ id }) => {
    const parent = useRedux((state) => {
        const vocal = state.image.circles[id] as Vocal;
        return state.image.circles[vocal.parentId] as Word | Consonant;
    });

    const placement = useRedux((state) => (state.image.circles[id] as Vocal).placement);

    const isNested = parent.type === ImageType.Consonant;

    return (
        <CircleSettings
            id={id}
            updateRadius={updateVocalRadius}
            updateDistance={updateVocalDistance}
            updateAngle={updateVocalAngle}
            disableDistance={
                (!isNested && placement === VocalPlacement.OnLine) || (isNested && placement === VocalPlacement.Inside)
            }
            disableAngle={
                isNested && placement === VocalPlacement.Outside && parent.placement === ConsonantPlacement.Inside
            }
        />
    );
};

export default VocalSettings;
