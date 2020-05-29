import { TextField } from '@material-ui/core';
import React, { useMemo } from 'react';
import { useRedux } from '../hooks/useRedux';
import { AppStore } from '../state/AppStore';
import { createSelector } from 'reselect';
import Maybe from '../utils/Maybe';

interface SettingsProps {
    className?: string;
}

const createSelectedSelector = () =>
    createSelector(
        (state: AppStore) => state.work.selection,
        (state: AppStore) => state.image.circles,
        (state: AppStore) => state.image.lineSlots,
        (selection, circles, lineSlots) => {
            const id = selection ?? '';
            return Maybe.of(circles[id]).or(() => Maybe.of(lineSlots[id]));
        }
    );

const Settings: React.FunctionComponent<SettingsProps> = ({ className }) => {
    const selectedSelector = useMemo(createSelectedSelector, []);
    const selected = useRedux((state) => selectedSelector(state));

    return selected
        .map((selected) => (
            <div key={selected.id} className={className}>
                {'r' in selected && <TextField type="number" label="Radius" variant="outlined" value={selected.r} />}
                <TextField type="number" label="Distance" variant="outlined" value={selected.parentDistance} />
                <TextField type="number" label="Angle" variant="outlined" value={selected.angle} />
            </div>
        ))
        .asNullable();
};

export default React.memo(Settings);
