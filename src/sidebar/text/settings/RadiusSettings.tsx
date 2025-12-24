import { useAppDispatch, useRedux } from '@/redux/hooks';
import { interactionActions } from '@/redux/slices/interactionSlice';
import historyThunks from '@/redux/thunks/historyThunks';
import svgThunks from '@/redux/thunks/svgThunks';
import type { CircleId } from '@/redux/types/svgTypes';
import Slider, { type SliderRef } from '@/ui/Slider';
import { formatDecimal } from '@/utils/format';
import React, { useId, useRef } from 'react';

interface RadiusSettingsProps {
    id: CircleId;
}

const RadiusSettings: React.FC<RadiusSettingsProps> = ({ id }) => {
    const sliderRef = useRef<SliderRef>(null);

    const dispatch = useAppDispatch();

    const radius = useRedux((state) => state.svg.circles[id].radius);

    const labelId = useId();
    const describeId = useId();

    return (
        <div className="flex flex-col gap-1">
            <span
                onClick={() => {
                    sliderRef.current?.focus();
                }}
            >
                <label id={labelId}>Radius</label>
                <span aria-hidden={true}>: </span>
                <span
                    id={describeId}
                    aria-hidden={true}
                >{`${formatDecimal(radius)} px`}</span>
            </span>
            <Slider
                ref={sliderRef}
                aria-labelledby={labelId}
                aria-describedby={describeId}
                min={0}
                max={500}
                step={1}
                value={radius}
                onPointerDown={() => {
                    dispatch(historyThunks.save());
                    dispatch(interactionActions.setDragging(true));
                }}
                onChange={(radius) => {
                    dispatch(svgThunks.setCircleRadius(id, radius));
                }}
                onPointerUp={() => {
                    dispatch(interactionActions.setDragging(false));
                }}
            />
        </div>
    );
};

export default RadiusSettings;
