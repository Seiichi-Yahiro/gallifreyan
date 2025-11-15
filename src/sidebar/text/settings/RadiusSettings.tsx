import Slider from '@/ui/Slider';
import { formatDecimal } from '@/utils/format';
import React from 'react';

interface RadiusSettingsProps {
    radius: number;
}

const RadiusSettings: React.FC<RadiusSettingsProps> = ({ radius }) => {
    return (
        <div className="flex flex-col gap-1">
            <div>{`Radius: ${formatDecimal(radius)} px`}</div>
            <Slider
                min={0}
                max={500}
                step={1}
                value={radius}
                onChange={() => {
                    // TODO
                }}
            />
        </div>
    );
};

export default RadiusSettings;
