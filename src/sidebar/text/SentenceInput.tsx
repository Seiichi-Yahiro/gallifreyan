import { useAppDispatch, useRedux } from '@/redux/hooks';
import historyThunks from '@/redux/thunks/historyThunks';
import textThunks from '@/redux/thunks/textThunks';
import TextInput from '@/ui/TextInput';
import { debounce } from 'es-toolkit';
import React from 'react';

const SentenceInput: React.FC = () => {
    const dispatch = useAppDispatch();
    const text = useRedux((state) => state.text.value);

    const saveHistoryDebounced = debounce(
        () => {
            dispatch(historyThunks.save());
        },
        500,
        { edges: ['leading'] },
    );

    const setText = (value: string) => {
        saveHistoryDebounced();
        dispatch(textThunks.setText(value));
    };

    return <TextInput label="Sentence" value={text} onChange={setText} />;
};

export default SentenceInput;
