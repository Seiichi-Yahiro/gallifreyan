import { TextField } from '@material-ui/core';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useRedux } from '../hooks/useRedux';
import { AppStore } from '../state/AppStore';
import { createSelector } from 'reselect';
import { updateCircleDataAction, updateLineSlotDataAction } from '../state/ImageStore';
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
            return Maybe.of(circles[id])
                .or(() => Maybe.of(lineSlots[id]))
                .map((selected) => ({ selected, id }));
        }
    );

const Settings: React.FunctionComponent<SettingsProps> = ({ className }) => {
    const dispatch = useDispatch();
    const selectedSelector = useMemo(createSelectedSelector, []);
    const selected = useRedux((state) => selectedSelector(state));

    return selected
        .map(({ selected, id }) => {
            const changeRadius = (event: React.ChangeEvent<HTMLInputElement>) => {
                const r = Number(event.currentTarget.value);
                dispatch(updateCircleDataAction({ id, r }));
            };

            const changeDistance = (event: React.ChangeEvent<HTMLInputElement>) => {
                const parentDistance = Number(event.currentTarget.value);
                if ('r' in selected) {
                    dispatch(updateCircleDataAction({ id, parentDistance }));
                } else {
                    dispatch(updateLineSlotDataAction({ id, parentDistance }));
                }
            };

            const changeAngle = (event: React.ChangeEvent<HTMLInputElement>) => {
                const angle = Number(event.currentTarget.value);
                if ('r' in selected) {
                    dispatch(updateCircleDataAction({ id, angle }));
                } else {
                    dispatch(updateLineSlotDataAction({ id, angle }));
                }
            };

            return (
                <div key={selected.id} className={className}>
                    {'r' in selected && (
                        <TextField
                            type="number"
                            label="Radius"
                            variant="outlined"
                            value={selected.r}
                            onChange={changeRadius}
                        />
                    )}
                    <TextField
                        type="number"
                        label="Distance"
                        variant="outlined"
                        value={selected.parentDistance}
                        onChange={changeDistance}
                    />
                    <TextField
                        type="number"
                        label="Angle"
                        variant="outlined"
                        value={selected.angle}
                        onChange={changeAngle}
                    />
                </div>
            );
        })
        .asNullable();
};

export default React.memo(Settings);
