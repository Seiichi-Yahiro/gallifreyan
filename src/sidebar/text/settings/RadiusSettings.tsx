import Slider from '@/ui/Slider';
import { formatDecimal } from '@/utils/format';
import React, { useId } from 'react';

interface RadiusSettingsProps {
    radius: number;
    onPointerDown?: () => void;
    onPointerUp?: () => void;
    onChange: (radius: number) => void;
}

const RadiusSettings: React.FC<RadiusSettingsProps> = ({
    radius,
    onPointerDown,
    onPointerUp,
    onChange,
}) => {
    const labelId = useId();
    const describeId = useId();

    return (
        <div className="flex flex-col gap-1">
            <span>
                <label id={labelId}>Radius</label>
                <span aria-hidden={true}>: </span>
                <span
                    id={describeId}
                    aria-hidden={true}
                >{`${formatDecimal(radius)} px`}</span>
            </span>
            <Slider
                aria-labelledby={labelId}
                aria-describedby={describeId}
                min={0}
                max={500}
                step={1}
                value={radius}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onChange={onChange}
            />
        </div>
    );
};

export default RadiusSettings;
