import React from 'react';
import { shallowEqual } from 'react-redux';
import { useRedux } from '../../../hooks/useRedux';
import { updateLineSlotAngle } from '../../../state/image/ImageThunks';
import { UUID } from '../../../state/image/ImageTypes';
import AngleInput from './AngleInput';

interface LineSlotSettingsProps {
    id: UUID;
}

const LineSlotSettings: React.FunctionComponent<LineSlotSettingsProps> = ({ id }) => {
    const { angle, relativeAngle } = useRedux((state) => {
        const lineSlot = state.image.lineSlots[id]!;
        const relativeAngle = state.image.circles[lineSlot.parentId]!.circle.angle;

        return { angle: lineSlot.angle, relativeAngle };
    }, shallowEqual);

    return <AngleInput id={id} angle={angle} updateAngle={updateLineSlotAngle} relativeAngle={relativeAngle} />;
};

export default LineSlotSettings;
