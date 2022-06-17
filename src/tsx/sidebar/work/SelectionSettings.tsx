import { TextField } from '@mui/material';
import React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useRedux } from '../../hooks/useRedux';
import { AppThunkAction } from '../../state/AppState';
import {
    moveConsonant,
    moveDot,
    moveLineSlot,
    moveSentence,
    moveVocal,
    moveWord,
    updateConsonantRadius,
    updateDotRadius,
    updateSentenceRadius,
    updateVocalRadius,
    updateWordRadius,
} from '../../state/image/ImageThunks';
import {
    CircleShape,
    Consonant,
    ConsonantPlacement,
    ImageType,
    PositionData,
    UUID,
    Vocal,
    VocalPlacement,
} from '../../state/image/ImageTypes';

interface SettingsProps {
    className?: string;
}

const SelectionSettings: React.FunctionComponent<SettingsProps> = ({ className }) => {
    const selection = useRedux((state) => state.work.selection);

    if (!selection) {
        return null;
    }

    const createSettings = () => {
        switch (selection.type) {
            case ImageType.Sentence:
                return (
                    <CircleSettings
                        id={selection.id}
                        updateRadius={updateSentenceRadius}
                        updatePositionData={moveSentence}
                    />
                );
            case ImageType.Word:
                return (
                    <CircleSettings id={selection.id} updateRadius={updateWordRadius} updatePositionData={moveWord} />
                );
            case ImageType.Consonant:
                return (
                    <CircleSettings
                        id={selection.id}
                        updateRadius={updateConsonantRadius}
                        updatePositionData={moveConsonant}
                        disableDistance={(consonant: Consonant) => consonant.placement === ConsonantPlacement.OnLine}
                    />
                );
            case ImageType.Vocal:
                return (
                    <CircleSettings
                        id={selection.id}
                        updateRadius={updateVocalRadius}
                        updatePositionData={moveVocal}
                        disableDistance={(vocal: Vocal) => vocal.placement === VocalPlacement.OnLine}
                    />
                );
            case ImageType.Dot:
                return <CircleSettings id={selection.id} updateRadius={updateDotRadius} updatePositionData={moveDot} />;
            case ImageType.LineSlot:
                return <LineSlotSettings id={selection.id} />;
            case ImageType.LineConnection:
                return null;
        }
    };

    return <div className={className}>{createSettings()}</div>;
};

interface CircleSettingsProps {
    id: UUID;
    updatePositionData: (id: UUID, positionData: Partial<PositionData>) => AppThunkAction;
    updateRadius: (id: UUID, r: number) => AppThunkAction;
    disableDistance?: (circleShape: CircleShape) => boolean;
}

const CircleSettings: React.FunctionComponent<CircleSettingsProps> = ({
    id,
    updatePositionData,
    updateRadius,
    disableDistance = () => false,
}) => {
    const dispatch = useAppDispatch();
    const circleShape = useRedux((state) => state.image.circles[id]!);

    const changeRadius = (event: React.ChangeEvent<HTMLInputElement>) => {
        const r = Number(event.currentTarget.value);
        dispatch(updateRadius(id, r));
    };

    const changeDistance = (event: React.ChangeEvent<HTMLInputElement>) => {
        const distance = Number(event.currentTarget.value);
        dispatch(updatePositionData(id, { distance }));
    };

    const changeAngle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const angle = Number(event.currentTarget.value);
        dispatch(updatePositionData(id, { angle }));
    };

    return (
        <>
            <TextField
                type="number"
                label="Radius"
                variant="outlined"
                value={circleShape.circle.r}
                onChange={changeRadius}
            />
            <TextField
                type="number"
                label="Distance"
                variant="outlined"
                value={circleShape.circle.distance}
                onChange={changeDistance}
                disabled={disableDistance(circleShape)}
            />
            <TextField
                type="number"
                label="Angle"
                variant="outlined"
                value={circleShape.circle.angle}
                onChange={changeAngle}
            />
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
        dispatch(moveLineSlot(id, { angle }));
    };

    return (
        <>
            <TextField type="number" label="Distance" variant="outlined" value={distance} disabled={true} />
            <TextField type="number" label="Angle" variant="outlined" value={angle} onChange={changeAngle} />
        </>
    );
};

export default React.memo(SelectionSettings);
