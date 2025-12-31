import historyThunks from '@/redux/history/history.thunks';
import { useAppDispatch, useRedux } from '@/redux/hooks';
import svgThunks from '@/redux/svg/svg.thunks';
import type { CircleId } from '@/redux/svg/svg.types';
import NumberInput from '@/ui/NumberInput';
import Slider, { type SliderRef } from '@/ui/Slider';
import { debounce, round } from 'es-toolkit';
import React, { useId, useRef } from 'react';

interface DistanceSettingsProps {
    id: CircleId;
}

const DistanceSettings: React.FC<DistanceSettingsProps> = ({ id }) => {
    const sliderRef = useRef<SliderRef>(null);

    const dispatch = useAppDispatch();

    const distance = useRedux(
        (state) => state.svg.circles[id].position.distance,
    );

    const isDragging = useRef(false);

    const debouncedHistorySave = debounce(
        () => {
            dispatch(historyThunks.save());
        },
        500,
        { edges: ['leading'] },
    );

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
                    Distance
                </label>
                <span aria-hidden={true}>: </span>
                <NumberInput
                    aria-labelledby={labelId}
                    value={distance}
                    min={0}
                    max={1000}
                    step={1}
                    onChange={(distance) => {
                        debouncedHistorySave();
                        dispatch(svgThunks.setCirclePosition(id, { distance }));
                    }}
                    unit="px"
                />
            </span>
            <Slider
                ref={sliderRef}
                aria-labelledby={labelId}
                min={0}
                max={1000}
                step={1}
                value={distance}
                onChange={(distance) => {
                    if (!isDragging.current) {
                        dispatch(historyThunks.save());
                        isDragging.current = true;
                    }

                    dispatch(
                        svgThunks.setCirclePosition(id, {
                            distance: round(distance),
                        }),
                    );
                }}
                onChangeCommitted={() => {
                    isDragging.current = false;
                }}
            />
        </div>
    );
};

export default DistanceSettings;
