import type { Angle } from '@/math/angle';
import AngleSlider from '@/ui/AngleSlider';
import { formatDecimal } from '@/utils/format';
import React from 'react';

interface AngleSettingsProps {
    angle: Angle;
}

const AngleSettings: React.FC<AngleSettingsProps> = ({ angle }) => {
    return (
        <div className="flex flex-col gap-1">
            <div>{`Angle: ${formatDecimal(angle.value)} ${angle.unit}`}</div>
            <div className="flex flex-row items-center justify-center">
                <AngleSlider
                    min={0}
                    max={360}
                    unit={angle.unit}
                    step={1}
                    value={angle.value}
                    onChange={() => {
                        // TODO
                    }}
                    className="max-w-60"
                />
            </div>
        </div>
    );
};

export default React.memo(AngleSettings);
