import { InputLabel } from '@mui/material';
import React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useRedux } from '../../../hooks/useRedux';
import { AppThunkAction } from '../../../state/AppState';
import { UUID } from '../../../state/image/ImageTypes';
import { Degree } from '../../../utils/LinearAlgebra';
import CircularSlider from './CircularSlider';

interface AngleInputProps {
    id: UUID;
    angle: Degree;
    updateAngle: (id: UUID, angle: Degree) => AppThunkAction;
    disabled?: boolean;
    relativeAngle?: Degree;
}

const AngleInput: React.FunctionComponent<AngleInputProps> = ({ id, angle, updateAngle, disabled, relativeAngle }) => {
    const dispatch = useAppDispatch();
    const angleConstraints = useRedux((state) => state.work.constraints[id]!.angle);

    const changeAngle = (angle: number) => {
        dispatch(updateAngle(id, angle));
    };

    return (
        <div className="sidebar-work-settings__angle">
            <InputLabel>Angle</InputLabel>
            <CircularSlider
                radius={50}
                value={angle}
                onChange={changeAngle}
                disabled={disabled}
                constraints={angleConstraints}
                relativeAngle={relativeAngle}
            />
        </div>
    );
};

export default React.memo(AngleInput);
