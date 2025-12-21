import { useAppDispatch, useRedux } from '@/redux/hooks';
import { settingsActions } from '@/redux/slices/settingsSlice';
import Checkbox from '@/ui/Checkbox';
import React from 'react';

const SettingsTab: React.FC = () => {
    const dispatch = useAppDispatch();
    const splitLetterOptions = useRedux(
        (state) => state.settings.splitLetterOptions,
    );

    const toggleDigraphs = (checked: boolean) => {
        dispatch(settingsActions.setSplitLetterOptions({ digraphs: checked }));
    };

    return (
        <div className="flex flex-row flex-wrap items-center gap-1">
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
    );
};

export default SettingsTab;
