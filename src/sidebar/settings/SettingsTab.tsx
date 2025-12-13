import { useAppDispatch, useRedux } from '@/redux/hooks';
import { textActions } from '@/redux/slices/textSlice';
import Checkbox from '@/ui/Checkbox';
import React from 'react';

const SettingsTab: React.FC = () => {
    const dispatch = useAppDispatch();
    const splitLetterOptions = useRedux(
        (state) => state.text.splitLetterOptions,
    );

    const toggleDigraphs = (checked: boolean) => {
        dispatch(textActions.setSplitLetterOptions({ digraphs: checked }));
    };

    return (
        <div className="flex flex-row flex-wrap items-center gap-1">
            <div>Convert Digraphs:</div>
            <Checkbox
                checked={splitLetterOptions.digraphs}
                onCheckedChange={toggleDigraphs}
            />
        </div>
    );
};

export default SettingsTab;
