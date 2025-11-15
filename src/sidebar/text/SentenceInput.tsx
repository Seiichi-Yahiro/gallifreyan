import { useAppDispatch, useRedux } from '@/redux/hooks';
import textActions from '@/redux/text/textActions';
import TextInput from '@/ui/TextInput';
import React, { useCallback } from 'react';

const SentenceInput: React.FC = () => {
    const dispatch = useAppDispatch();
    const text = useRedux((state) => state.main.text.value);

    const setText = useCallback(
        (value: string) => {
            dispatch(textActions.setText(value));
        },
        [dispatch],
    );

    return <TextInput label="Sentence" value={text} onChange={setText} />;
};

export default SentenceInput;
