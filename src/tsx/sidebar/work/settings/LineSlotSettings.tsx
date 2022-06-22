import React from 'react';
import { useRedux } from '../../../hooks/useRedux';
import { updateLineSlotAngle, updateLineSlotDistance } from '../../../state/image/ImageThunks';
import { UUID } from '../../../state/image/ImageTypes';
import AngleInput from './AngleInput';
import DistanceInput from './DistanceInput';

interface LineSlotSettingsProps {
    id: UUID;
}

const LineSlotSettings: React.FunctionComponent<LineSlotSettingsProps> = ({ id }) => {
    const { distance, angle } = useRedux((state) => state.image.lineSlots[id])!;

    return (
        <>
            <DistanceInput id={id} distance={distance} updateDistance={updateLineSlotDistance} disabled={true} />
            <AngleInput id={id} angle={angle} updateAngle={updateLineSlotAngle} />
        </>
    );
};

export default LineSlotSettings;
