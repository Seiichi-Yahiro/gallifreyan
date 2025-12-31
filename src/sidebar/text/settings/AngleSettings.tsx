import mAngle, { AngleUnit } from '@/math/angle';
import { useSaveHistoryDebounced } from '@/redux/history/history.hooks';
import historyThunks from '@/redux/history/history.thunks';
import { useAppDispatch, useRedux } from '@/redux/hooks';
import ids, { type LineSlotId } from '@/redux/ids';
import { svgActions } from '@/redux/svg/svg.slice';
import svgThunks from '@/redux/svg/svg.thunks';
import type { CircleId } from '@/redux/svg/svg.types';
import AngleSlider, { type AngleSliderRef } from '@/ui/AngleSlider';
import NumberInput from '@/ui/NumberInput';
import { round } from 'es-toolkit';
import React, { useId, useRef } from 'react';

interface AngleSettingsProps {
    id: CircleId | LineSlotId;
}

const AngleSettings: React.FC<AngleSettingsProps> = ({ id }) => {
    const sliderRef = useRef<AngleSliderRef>(null);

    const dispatch = useAppDispatch();

    const angle = useRedux((state) =>
        ids.lineSlot.is(id)
            ? state.svg.lineSlots[id].position.angle
            : state.svg.circles[id].position.angle,
    );

    const angleInDegree = mAngle.toDegree(angle);

    const parentAngle =
        useRedux((state) =>
            ids.dot.is(id) || ids.lineSlot.is(id)
                ? state.svg.circles[state.text.elements[id].parent].position
                      .angle
                : undefined,
        ) ?? mAngle.radian(0);

    const parentAngleInDegree = mAngle.toDegree(parentAngle);

    const isDragging = useRef(false);

    const saveHistoryDebounced = useSaveHistoryDebounced();

    const labelId = useId();

    return (
        <div className="flex flex-col gap-1">
            <span>
                <label
                    id={labelId}
                    onClick={() => {
                        sliderRef.current?.focus();
                    }}
                >
                    Angle
                </label>
                <span aria-hidden={true}>: </span>
                <NumberInput
                    aria-labelledby={labelId}
                    value={angleInDegree.value}
                    step={1}
                    min={0}
                    max={360}
                    onChange={(degrees) => {
                        saveHistoryDebounced();

                        const angle = mAngle.toRadian(mAngle.degree(degrees));

                        if (ids.lineSlot.is(id)) {
                            dispatch(
                                svgActions.setLineSlotPosition({
                                    id,
                                    position: {
                                        angle,
                                    },
                                }),
                            );
                        } else {
                            dispatch(
                                svgThunks.setCirclePosition(id, {
                                    angle,
                                }),
                            );
                        }
                    }}
                    unit={angleInDegree.unit}
                />
            </span>
            <div className="flex flex-row items-center justify-center">
                <AngleSlider
                    ref={sliderRef}
                    aria-labelledby={labelId}
                    className="max-w-60"
                    unit={AngleUnit.Degree}
                    value={angleInDegree.value}
                    step={1}
                    rotation={parentAngleInDegree.value}
                    onChange={(newAngleValue) => {
                        if (!isDragging.current) {
                            dispatch(historyThunks.save());
                            isDragging.current = true;
                        }

                        const newAngle = mAngle.toRadian(
                            mAngle.degree(round(newAngleValue)),
                        );

                        if (ids.lineSlot.is(id)) {
                            dispatch(
                                svgActions.setLineSlotPosition({
                                    id,
                                    position: {
                                        angle: newAngle,
                                    },
                                }),
                            );
                        } else {
                            dispatch(
                                svgThunks.setCirclePosition(id, {
                                    angle: newAngle,
                                }),
                            );
                        }
                    }}
                    onChangeCommitted={() => {
                        isDragging.current = false;
                    }}
                />
            </div>
        </div>
    );
};

export default AngleSettings;
