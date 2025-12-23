import Slider from '@/ui/Slider';
import { formatDecimal } from '@/utils/format';
import React, { useId } from 'react';

interface DistanceSettingsProps {
    distance: number;
    min: number;
    max: number;
    onPointerDown?: () => void;
    onPointerUp?: () => void;
    onChange: (distance: number) => void;
}

const DistanceSettings: React.FC<DistanceSettingsProps> = ({
    distance,
    min,
    max,
    onPointerDown,
    onPointerUp,
    onChange,
}) => {
    const labelId = useId();
    const describeId = useId();

    return (
        <div className="flex flex-col gap-1">
            <span>
                <label id={labelId}>Distance</label>
                <span aria-hidden={true}>: </span>
                <span
                    id={describeId}
                    aria-hidden={true}
                >{`${formatDecimal(distance)} px`}</span>
            </span>
            <Slider
                aria-labelledby={labelId}
                aria-describedby={describeId}
                min={min}
                max={max}
                step={1}
                value={distance}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onChange={onChange}
            />
        </div>
    );
};

export default DistanceSettings;
