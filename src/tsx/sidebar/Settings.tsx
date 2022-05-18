import { TextField } from '@mui/material';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useRedux } from '../hooks/useRedux';
import { AppState } from '../state/AppState';
import { createSelector } from 'reselect';
import { updateCircleData, updateLineSlotData } from '../state/ImageState';
import Maybe from '../utils/Maybe';

interface SettingsProps {
    className?: string;
}

const createSelectedSelector = () =>
    createSelector(
        (state: AppState) => state.work.selection,
        (state: AppState) => state.image.circles,
        (state: AppState) => state.image.lineSlots,
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
            const isCircle = 'r' in selected;

            const changeRadius = (event: React.ChangeEvent<HTMLInputElement>) => {
                const r = Number(event.currentTarget.value);
                dispatch(updateCircleData({ id, r }));
            };

            const changeDistance = (event: React.ChangeEvent<HTMLInputElement>) => {
                const distance = Number(event.currentTarget.value);
                if (isCircle) {
                    dispatch(updateCircleData({ id, distance }));
                }
            };

            const changeAngle = (event: React.ChangeEvent<HTMLInputElement>) => {
                const angle = Number(event.currentTarget.value);
                if (isCircle) {
                    dispatch(updateCircleData({ id, angle }));
                } else {
                    dispatch(updateLineSlotData({ id, angle }));
                }
            };

            return (
                <div key={selected.id} className={className}>
                    {isCircle && (
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
                        value={selected.distance}
                        onChange={changeDistance}
                        disabled={!isCircle}
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
