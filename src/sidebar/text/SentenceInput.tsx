import { useSaveHistoryDebounced } from '@/redux/history/history.hooks';
import { useAppDispatch, useRedux } from '@/redux/hooks';
import textThunks from '@/redux/text/text.thunks';
import TextInput from '@/ui/TextInput';
import React from 'react';

const SentenceInput: React.FC = () => {
    const dispatch = useAppDispatch();
    const text = useRedux((state) => state.text.value);

    const saveHistoryDebounced = useSaveHistoryDebounced();

    const setText = (value: string) => {
        saveHistoryDebounced();
        dispatch(textThunks.setText(value));
    };

    return <TextInput label="Sentence" value={text} onChange={setText} />;
};

export default SentenceInput;
