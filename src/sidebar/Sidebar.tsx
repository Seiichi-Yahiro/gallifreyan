import { useAppDispatch, useRedux } from '@/redux/hooks';
import textActions from '@/redux/text/textActions';
import TextInput from '@/ui/TextInput';
import React, { useCallback } from 'react';

interface SidebarProps {
    className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
    const dispatch = useAppDispatch();
    const text = useRedux((state) => state.text.value);

    const setText = useCallback(
        (value: string) => {
            dispatch(textActions.setText(value));
        },
        [dispatch],
    );

    return (
        <div className={className}>
            <TextInput label="Sentence" value={text} onChange={setText} />
        </div>
    );
};

export default Sidebar;
