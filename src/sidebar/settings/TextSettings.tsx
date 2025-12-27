import { useAppDispatch, useRedux } from '@/redux/hooks';
import { settingsActions } from '@/redux/settings/settingsSlice';
import Checkbox from '@/ui/Checkbox';
import React from 'react';

interface TextSettingsProps {
    className?: string;
}

const TextSettings: React.FC<TextSettingsProps> = ({ className }) => {
    const dispatch = useAppDispatch();
    const splitLetterOptions = useRedux(
        (state) => state.settings.splitLetterOptions,
    );

    const toggleDigraphs = (checked: boolean) => {
        dispatch(settingsActions.setSplitLetterOptions({ digraphs: checked }));
    };

    const id = 'text-settings-label';

    return (
        <section aria-labelledby={id} className={className}>
            <h2 id={id} className="font-semibold">
                Text
            </h2>
            <div className="flex flex-row flex-wrap items-center gap-2">
                <span>
                    <label id="convert-digraphs">Convert Digraphs</label>
                    <span aria-hidden={true}>:</span>
                </span>
                <Checkbox
                    aria-labelledby="convert-digraphs"
                    aria-checked={splitLetterOptions.digraphs}
                    checked={splitLetterOptions.digraphs}
                    onCheckedChange={toggleDigraphs}
                />
            </div>
        </section>
    );
};

export default TextSettings;
