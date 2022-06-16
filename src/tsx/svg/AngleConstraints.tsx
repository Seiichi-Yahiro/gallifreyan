import { useTheme } from '@mui/material';
import { useRedux } from '../hooks/useRedux';
import { UUID } from '../state/image/ImageTypes';
import React from 'react';

interface AngleConstraintsProps {
    radius: number;
    renderFor: UUID[];
}

const AngleConstraints: React.FunctionComponent<AngleConstraintsProps> = ({ renderFor, radius }) => {
    const theme = useTheme();

    const angleConstraints = useRedux((state) =>
        state.work.selection?.isDragging && renderFor.includes(state.work.selection.id)
            ? state.work.selection.angleConstraints
            : undefined
    );

    if (!angleConstraints) {
        return null;
    }

    return (
        <g stroke={theme.palette.error.main} strokeLinecap="round">
            <line x1={0} y1={0} x2={0} y2={radius} style={{ transform: `rotate(${-angleConstraints.minAngle}deg)` }} />
            <line x1={0} y1={0} x2={0} y2={radius} style={{ transform: `rotate(${-angleConstraints.maxAngle}deg)` }} />
        </g>
    );
};

export default React.memo(AngleConstraints);
