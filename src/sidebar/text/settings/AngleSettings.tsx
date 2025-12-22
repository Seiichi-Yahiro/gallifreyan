import mAngle, { type Degree } from '@/math/angle';
import AngleSlider from '@/ui/AngleSlider';
import { formatDecimal } from '@/utils/format';
import React, { useId } from 'react';

interface AngleSettingsProps {
    angle: Degree;
    parentAngle?: Degree;
    min?: Degree;
    max?: Degree;
    onPointerDown?: () => void;
    onPointerUp?: () => void;
    onChange: (angle: Degree) => void;
}

const AngleSettings: React.FC<AngleSettingsProps> = ({
    angle,
    parentAngle = mAngle.degree(0),
    min,
    max,
    onPointerDown,
    onPointerUp,
    onChange,
}) => {
    const step = mAngle.degree(1);

    const onValueChange = (value: number) => {
        onChange(
            mAngle.normalize(mAngle.sub(mAngle.degree(value), parentAngle)),
        );
    };

    const labelId = useId();
    const describeId = useId();

    return (
        <div className="flex flex-col gap-1">
            <span>
                <label id={labelId}>Angle</label>
                <span aria-hidden={true}>: </span>
                <span
                    id={describeId}
                    aria-hidden={true}
                >{`${formatDecimal(angle.value)} ${angle.unit}`}</span>
            </span>
            <div className="overflow-hidden">
                <div
                    className="flex flex-row items-center justify-center"
                    style={{
                        rotate: `${-parentAngle.value}${parentAngle.unit}`,
                    }}
                >
                    <AngleSlider
                        aria-labelledby={labelId}
                        aria-describedby={describeId}
                        unit={angle.unit}
                        value={angle.value}
                        step={step.value}
                        min={min?.value}
                        max={max?.value}
                        onPointerDown={onPointerDown}
                        onPointerUp={onPointerUp}
                        onChange={onValueChange}
                        className="max-w-60"
                    />
                </div>
            </div>
        </div>
    );
};

export default AngleSettings;
