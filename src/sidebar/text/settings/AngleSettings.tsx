import mAngle, { type Angle } from '@/math/angle';
import AngleSlider from '@/ui/AngleSlider';
import { formatDecimal } from '@/utils/format';
import React from 'react';

interface AngleSettingsProps {
    angle: Angle;
    parentAngle?: Angle;
}

const AngleSettings: React.FC<AngleSettingsProps> = ({
    angle,
    parentAngle = mAngle.degree(0),
}) => {
    return (
        <div className="flex flex-col gap-1">
            <div>{`Angle: ${formatDecimal(angle.value)} ${angle.unit}`}</div>
            <div className="overflow-hidden">
                <div
                    className="flex flex-row items-center justify-center"
                    style={{ rotate: -parentAngle.value + parentAngle.unit }}
                >
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
        </div>
    );
};

export default AngleSettings;
