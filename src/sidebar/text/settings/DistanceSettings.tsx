import Slider from '@/ui/Slider';
import { formatDecimal } from '@/utils/format';
import React from 'react';

interface DistanceSettingsProps {
    distance: number;
    onChange: (distance: number) => void;
}

const DistanceSettings: React.FC<DistanceSettingsProps> = ({
    distance,
    onChange,
}) => {
    return (
        <div className="flex flex-col gap-1">
            <div>{`Distance: ${formatDecimal(distance)} px`}</div>
            <Slider
                min={0}
                max={1000}
                step={1}
                value={distance}
                onChange={onChange}
            />
        </div>
    );
};

export default DistanceSettings;
