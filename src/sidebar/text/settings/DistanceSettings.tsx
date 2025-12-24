import { useAppDispatch, useRedux } from '@/redux/hooks';
import { interactionActions } from '@/redux/slices/interactionSlice';
import historyThunks from '@/redux/thunks/historyThunks';
import svgThunks from '@/redux/thunks/svgThunks';
import type { CircleId } from '@/redux/types/svgTypes';
import Slider, { type SliderRef } from '@/ui/Slider';
import { formatDecimal } from '@/utils/format';
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

    const labelId = useId();
    const describeId = useId();

    return (
        <div className="flex flex-col gap-1">
            <span
                onClick={() => {
                    sliderRef.current?.focus();
                }}
            >
                <label id={labelId}>Distance</label>
                <span aria-hidden={true}>: </span>
                <span
                    id={describeId}
                    aria-hidden={true}
                >{`${formatDecimal(distance)} px`}</span>
            </span>
            <Slider
                ref={sliderRef}
                aria-labelledby={labelId}
                aria-describedby={describeId}
                min={0}
                max={1000}
                step={1}
                value={distance}
                onPointerDown={() => {
                    dispatch(historyThunks.save());
                    dispatch(interactionActions.setDragging(true));
                }}
                onChange={(distance) => {
                    dispatch(svgThunks.setCirclePosition(id, { distance }));
                }}
                onPointerUp={() => {
                    dispatch(interactionActions.setDragging(false));
                }}
            />
        </div>
    );
};

export default DistanceSettings;
