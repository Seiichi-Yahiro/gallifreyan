import { TextField } from '@mui/material';
import React from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useRedux } from '../hooks/useRedux';
import { updateCircleData, updateLineSlotData } from '../state/image/ImageActions';
import { ImageType, UUID } from '../state/image/ImageTypes';

interface SettingsProps {
    className?: string;
}

const Settings: React.FunctionComponent<SettingsProps> = ({ className }) => {
    const selection = useRedux((state) => state.work.selection);

    if (!selection) {
        return null;
    }

    switch (selection.type) {
        case ImageType.Sentence:
        case ImageType.Word:
        case ImageType.Consonant:
        case ImageType.Vocal:
        case ImageType.Dot:
            return (
                <div className={className}>
                    <CircleSettings id={selection.id} />
                </div>
            );
        case ImageType.LineSlot:
            return (
                <div className={className}>
                    <LineSlotSettings id={selection.id} />
                </div>
            );
        case ImageType.LineConnection:
            return null;
        default:
            return null;
    }
};

interface CircleSettingsProps {
    id: UUID;
}

const CircleSettings: React.FunctionComponent<CircleSettingsProps> = ({ id }) => {
    const { circle } = useRedux((state) => state.image.circles[id])!;
    const dispatch = useAppDispatch();

    const changeRadius = (event: React.ChangeEvent<HTMLInputElement>) => {
        const r = Number(event.currentTarget.value);
        dispatch(updateCircleData({ id, circle: { r } }));
    };

    const changeDistance = (event: React.ChangeEvent<HTMLInputElement>) => {
        const distance = Number(event.currentTarget.value);
        dispatch(updateCircleData({ id, circle: { distance } }));
    };

    const changeAngle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const angle = Number(event.currentTarget.value);
        dispatch(updateCircleData({ id, circle: { angle } }));
    };

    return (
        <>
            <TextField type="number" label="Radius" variant="outlined" value={circle.r} onChange={changeRadius} />
            <TextField
                type="number"
                label="Distance"
                variant="outlined"
                value={circle.distance}
                onChange={changeDistance}
            />
            <TextField type="number" label="Angle" variant="outlined" value={circle.angle} onChange={changeAngle} />
        </>
    );
};

interface LineSlotSettingsProps {
    id: UUID;
}

const LineSlotSettings: React.FunctionComponent<LineSlotSettingsProps> = ({ id }) => {
    const { distance, angle } = useRedux((state) => state.image.lineSlots[id])!;
    const dispatch = useAppDispatch();

    const changeAngle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const angle = Number(event.currentTarget.value);
        dispatch(updateLineSlotData({ id, positionData: { angle } }));
    };

    return (
        <>
            <TextField type="number" label="Distance" variant="outlined" value={distance} disabled={true} />
            <TextField type="number" label="Angle" variant="outlined" value={angle} onChange={changeAngle} />
        </>
    );
};

export default React.memo(Settings);
