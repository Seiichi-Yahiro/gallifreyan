import { useTheme } from '@mui/material';
import { AngleConstraints as Constraints } from '../state/work/WorkTypes';
import React from 'react';

interface AngleConstraintsProps {
    angleConstraints: Constraints;
}

const AngleConstraints: React.FunctionComponent<AngleConstraintsProps> = ({ angleConstraints }) => {
    const theme = useTheme();

    return (
        <g stroke={theme.palette.error.main} strokeLinecap="round">
            <line x1={0} y1={0} x2={angleConstraints.minAngleVector.x} y2={angleConstraints.minAngleVector.y} />
            <line x1={0} y1={0} x2={angleConstraints.maxAngleVector.x} y2={angleConstraints.maxAngleVector.y} />
        </g>
    );
};

export default AngleConstraints;
