import { useAppDispatch, useRedux } from '@/redux/hooks';
import { svgActions } from '@/redux/svg/svg.slice';
import NumberInput from '@/ui/NumberInput';
import React from 'react';

interface SvgSettingsProps {
    className?: string;
}

const SvgSettings: React.FC<SvgSettingsProps> = ({ className }) => {
    const dispatch = useAppDispatch();
    const strokeWidth = useRedux((state) => state.svg.settings.strokeWidth);

    const id = 'svg-settings-label';

    return (
        <section aria-labelledby={id} className={className}>
            <h2 id={id} className="font-semibold">
                Svg
            </h2>
            <div className="flex flex-row flex-wrap items-center gap-2">
                <span>
                    <label id="stroke-width">Stroke width</label>
                    <span aria-hidden={true}>:</span>
                </span>
                <NumberInput
                    aria-labelledby="stroke-width"
                    value={strokeWidth}
                    min={1}
                    unit="px"
                    onChange={(value) => {
                        dispatch(
                            svgActions.setSettings({
                                strokeWidth: value,
                            }),
                        );
                    }}
                />
            </div>
        </section>
    );
};

export default SvgSettings;
