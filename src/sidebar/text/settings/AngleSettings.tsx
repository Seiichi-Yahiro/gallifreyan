import mAngle, { AngleUnit } from '@/math/angle';
import { useAppDispatch, useRedux } from '@/redux/hooks';
import ids, { type LineSlotId } from '@/redux/ids';
import { svgActions } from '@/redux/slices/svgSlice';
import historyThunks from '@/redux/thunks/historyThunks';
import svgThunks from '@/redux/thunks/svgThunks';
import type { CircleId } from '@/redux/types/svgTypes';
import AngleSlider, { type AngleSliderRef } from '@/ui/AngleSlider';
import { formatDecimal } from '@/utils/format';
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

    const isEditing = useRef(false);

    const labelId = useId();
    const describeId = useId();

    return (
        <div className="flex flex-col gap-1">
            <span
                onClick={() => {
                    sliderRef.current?.focus();
                }}
            >
                <label id={labelId}>Angle</label>
                <span aria-hidden={true}>: </span>
                <span
                    id={describeId}
                    aria-hidden={true}
                >{`${formatDecimal(angleInDegree.value)} ${angleInDegree.unit}`}</span>
            </span>
            <div className="flex flex-row items-center justify-center">
                <AngleSlider
                    ref={sliderRef}
                    aria-labelledby={labelId}
                    aria-describedby={describeId}
                    className="max-w-60"
                    unit={AngleUnit.Radian}
                    value={angle.value}
                    step={mAngle.toRadian(mAngle.degree(1)).value}
                    rotation={parentAngle.value}
                    onChange={(newAngleValue) => {
                        if (!isEditing.current) {
                            dispatch(historyThunks.save());
                            isEditing.current = true;
                        }

                        const newAngle = mAngle.radian(newAngleValue);

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
                        isEditing.current = false;
                    }}
                />
            </div>
        </div>
    );
};

export default AngleSettings;
