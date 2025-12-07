import mAngle, { type Angle, AngleUnit } from '@/math/angle';
import AngleSlider from '@/ui/AngleSlider';
import { formatDecimal } from '@/utils/format';
import React from 'react';

interface AngleSettingsProps {
    unit: AngleUnit;
    angle: Angle;
    parentAngle?: Angle;
    onChange: (angle: Angle) => void;
}

const AngleSettings: React.FC<AngleSettingsProps> = ({
    unit,
    angle,
    parentAngle,
    onChange,
}) => {
    const current = mAngle.toUnit(angle, unit);
    const parent: Angle = parentAngle
        ? mAngle.toUnit(parentAngle, unit)
        : { value: 0, unit };

    const max = unit === AngleUnit.Degree ? 360 : Math.PI * 2;
    const step = mAngle.toUnit(mAngle.degree(1), unit).value;

    const onValueChange = (value: number) => {
        const valueAngle: Angle = {
            value,
            unit,
        };

        onChange(mAngle.normalize(mAngle.sub(valueAngle, parent)));
    };

    return (
        <div className="flex flex-col gap-1">
            <div>{`Angle: ${formatDecimal(current.value)} ${current.unit}`}</div>
            <div className="overflow-hidden">
                <div
                    className="flex flex-row items-center justify-center"
                    style={{ rotate: -parent.value + parent.unit }}
                >
                    <AngleSlider
                        min={0}
                        max={max}
                        unit={current.unit}
                        step={step}
                        value={current.value}
                        onChange={onValueChange}
                        className="max-w-60"
                    />
                </div>
            </div>
        </div>
    );
};

export default AngleSettings;
