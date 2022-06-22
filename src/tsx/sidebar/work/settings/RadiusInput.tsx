import { InputLabel, Slider } from '@mui/material';
import React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { AppThunkAction } from '../../../state/AppState';
import { UUID } from '../../../state/image/ImageTypes';

interface RadiusInputProps {
    id: UUID;
    radius: number;
    updateRadius: (id: UUID, r: number) => AppThunkAction;
    disabled?: boolean;
}

const RadiusInput: React.FunctionComponent<RadiusInputProps> = ({ id, radius, updateRadius, disabled }) => {
    const dispatch = useAppDispatch();
    // TODO constraints

    const changeRadius = (_event: Event, r: number) => {
        dispatch(updateRadius(id, r));
    };

    return (
        <div className="sidebar-work-settings__radius">
            <InputLabel>Radius</InputLabel>
            <Slider
                valueLabelDisplay="off"
                value={radius}
                min={1}
                max={500}
                onChange={changeRadius}
                track={false}
                disabled={disabled}
            />
        </div>
    );
};

export default React.memo(RadiusInput);
