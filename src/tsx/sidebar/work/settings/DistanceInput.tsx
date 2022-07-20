import { InputLabel, Slider } from '@mui/material';
import React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useRedux } from '../../../hooks/useRedux';
import { AppThunkAction } from '../../../state/AppState';
import { UUID } from '../../../state/image/ImageTypes';

interface DistanceInputProps {
    id: UUID;
    distance: number;
    updateDistance: (id: UUID, distance: number) => AppThunkAction;
    disabled?: boolean;
}

const DistanceInput: React.FunctionComponent<DistanceInputProps> = ({ id, distance, updateDistance, disabled }) => {
    const dispatch = useAppDispatch();
    const { minDistance, maxDistance } = useRedux((state) => state.work.constraints[id]!.distance);

    const changeDistance = (_event: Event, distance: number) => {
        dispatch(updateDistance(id, distance));
    };

    const diff = maxDistance - minDistance;

    return (
        <div className="sidebar-work-settings__distance">
            <InputLabel>Distance</InputLabel>
            <Slider
                valueLabelDisplay="off"
                value={distance}
                min={minDistance}
                max={maxDistance}
                step={diff / 100}
                onChange={changeDistance}
                track={false}
                disabled={diff < 1e-8 || disabled}
            />
        </div>
    );
};

export default React.memo(DistanceInput);
