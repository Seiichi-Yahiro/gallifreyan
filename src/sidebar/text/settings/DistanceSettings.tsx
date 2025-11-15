import Slider from '@/ui/Slider';
import { formatDecimal } from '@/utils/format';
import React from 'react';

interface DistanceSettingsProps {
    distance: number;
}

const DistanceSettings: React.FC<DistanceSettingsProps> = ({ distance }) => {
    return (
        <div className="flex flex-col gap-1">
            <div>{`Distance: ${formatDecimal(distance)} px`}</div>
            <Slider
                min={0}
                max={1000}
                step={1}
                value={distance}
                onChange={() => {
                    // TODO
                }}
            />
        </div>
    );
};

export default DistanceSettings;
