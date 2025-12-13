import { useAppDispatch, useRedux } from '@/redux/hooks';
import textThunks from '@/redux/thunks/textThunks';
import TextInput from '@/ui/TextInput';
import React from 'react';

const SentenceInput: React.FC = () => {
    const dispatch = useAppDispatch();
    const text = useRedux((state) => state.text.value);

    const setText = (value: string) => {
        dispatch(textThunks.setText(value));
    };

    return <TextInput label="Sentence" value={text} onChange={setText} />;
};

export default SentenceInput;
