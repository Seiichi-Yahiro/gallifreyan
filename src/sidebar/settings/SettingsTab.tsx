import { useAppDispatch, useRedux } from '@/redux/hooks';
import textActions from '@/redux/text/textActions';
import { Checkbox } from '@/ui/Checkbox';
import React, { useCallback } from 'react';

const SettingsTab: React.FC = () => {
    const dispatch = useAppDispatch();
    const splitLetterOptions = useRedux(
        (state) => state.main.text.splitLetterOptions,
    );

    const toggleDigraphs = useCallback(
        (checked: boolean) => {
            dispatch(textActions.setSplitLetterOptions({ digraphs: checked }));
        },
        [dispatch],
    );

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

export default React.memo(SettingsTab);
