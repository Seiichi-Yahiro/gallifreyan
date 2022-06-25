import React from 'react';
import { useRedux } from '../../../hooks/useRedux';
import { updateLineSlotAngle } from '../../../state/image/ImageThunks';
import { UUID } from '../../../state/image/ImageTypes';
import AngleInput from './AngleInput';

interface LineSlotSettingsProps {
    id: UUID;
}

const LineSlotSettings: React.FunctionComponent<LineSlotSettingsProps> = ({ id }) => {
    const angle = useRedux((state) => state.image.lineSlots[id]!.angle);

    return <AngleInput id={id} angle={angle} updateAngle={updateLineSlotAngle} />;
};

export default LineSlotSettings;
