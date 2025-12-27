import historyThunks from '@/redux/history/historyThunks';
import { useAppDispatch, useRedux } from '@/redux/hooks';
import svgThunks from '@/redux/svg/svgThunks';
import type { CircleId } from '@/redux/svg/svgTypes';
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
                onChange={(radius) => {
                    if (!isEditing.current) {
                        dispatch(historyThunks.save());
                        isEditing.current = true;
                    }

                    dispatch(svgThunks.setCircleRadius(id, radius));
                }}
                onChangeCommitted={() => {
                    isEditing.current = false;
                }}
            />
        </div>
    );
};

export default RadiusSettings;
