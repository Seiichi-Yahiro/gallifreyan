import { TextField } from '@mui/material';
import React from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useRedux } from '../hooks/useRedux';
import { updateCircleData, updateLineSlotData } from '../state/image/ImageActions';
import { Circle, UUID } from '../state/image/ImageTypes';

interface SettingsProps {
    className?: string;
}

const Settings: React.FunctionComponent<SettingsProps> = ({ className }) => {
    const circle = useRedux((state) => state.image.circles[state.work.selection ?? '']);
    const lineSlot = useRedux((state) => state.image.lineSlots[state.work.selection ?? '']);

    if (circle) {
        return (
            <div className={className}>
                <CircleSettings id={circle.id} circle={circle.circle} />
            </div>
        );
    } else if (lineSlot) {
        return (
            <div className={className}>
                <LineSlotSettings id={lineSlot.id} angle={lineSlot.angle} distance={lineSlot.distance} />
            </div>
        );
    } else {
        return null;
    }
};

interface CircleSettingsProps {
    id: UUID;
    circle: Circle;
}

const CircleSettings: React.FunctionComponent<CircleSettingsProps> = ({ id, circle }) => {
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
    distance: number;
    angle: number;
}

const LineSlotSettings: React.FunctionComponent<LineSlotSettingsProps> = ({ id, distance, angle }) => {
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
