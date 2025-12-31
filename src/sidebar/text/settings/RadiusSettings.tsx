import { useSaveHistoryDebounced } from '@/redux/history/history.hooks';
import historyThunks from '@/redux/history/history.thunks';
import { useAppDispatch, useRedux } from '@/redux/hooks';
import svgThunks from '@/redux/svg/svg.thunks';
import type { CircleId } from '@/redux/svg/svg.types';
import NumberInput from '@/ui/NumberInput';
import Slider, { type SliderRef } from '@/ui/Slider';
import { round } from 'es-toolkit';
import React, { useId, useRef } from 'react';

interface RadiusSettingsProps {
    id: CircleId;
}

const RadiusSettings: React.FC<RadiusSettingsProps> = ({ id }) => {
    const sliderRef = useRef<SliderRef>(null);

    const dispatch = useAppDispatch();

    const radius = useRedux((state) => state.svg.circles[id].radius);

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
                    Radius
                </label>
                <span aria-hidden={true}>: </span>
                <NumberInput
                    aria-labelledby={labelId}
                    value={radius}
                    min={0}
                    max={500}
                    step={1}
                    onChange={(radius) => {
                        saveHistoryDebounced();
                        dispatch(svgThunks.setCircleRadius(id, radius));
                    }}
                    unit="px"
                />
            </span>
            <Slider
                ref={sliderRef}
                aria-labelledby={labelId}
                min={0}
                max={500}
                step={1}
                value={radius}
                onChange={(radius) => {
                    if (!isDragging.current) {
                        dispatch(historyThunks.save());
                        isDragging.current = true;
                    }

                    dispatch(svgThunks.setCircleRadius(id, round(radius)));
                }}
                onChangeCommitted={() => {
                    isDragging.current = false;
                }}
            />
        </div>
    );
};

export default RadiusSettings;
