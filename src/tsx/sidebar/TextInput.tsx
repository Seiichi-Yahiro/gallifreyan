import React, { ChangeEvent } from 'react';
import { TextField } from '@mui/material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useRedux } from '../hooks/useRedux';
import { setInputText } from '../state/work/WorkThunks';

const TextInput: React.FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const text = useRedux((state) => state.work.textInput.text);

    const onChange = (input: ChangeEvent<HTMLInputElement>) => {
        const inputValue = input.target.value;
        dispatch(setInputText(inputValue));
    };

    return (
        <TextField
            variant="standard"
            placeholder="Type a sentence..."
            value={text}
            onChange={onChange}
            autoComplete="off"
            spellCheck={false}
        />
    );
};

export default TextInput;
