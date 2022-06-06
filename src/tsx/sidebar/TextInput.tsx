import React, { ChangeEvent, useEffect, useRef } from 'react';
import { TextField } from '@mui/material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useRedux } from '../hooks/useRedux';
import { setSentence } from '../state/image/ImageThunks';
import { setInputText } from '../state/work/WorkActions';
import { isValidLetter } from '../utils/LetterGroups';
import { splitWordToChars } from '../utils/TextConverter';

const TextInput: React.FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const text = useRedux((state) => state.work.inputText);
    const sanitizedText = useRef('');

    useEffect(() => {
        dispatch(setSentence(sanitizedText.current));
    }, [sanitizedText.current]);

    const onChange = (input: ChangeEvent<HTMLInputElement>) => {
        const inputValue = input.target.value;

        sanitizedText.current = inputValue
            .split(' ')
            .map((word) => splitWordToChars(word).filter(isValidLetter).join(''))
            .filter((word) => word.length > 0)
            .join(' ');

        dispatch(setInputText(inputValue));
    };

    return (
        <TextField
            variant="standard"
            placeholder="Type a sentence..."
            value={text}
            onChange={onChange}
            autoComplete="off"
        />
    );
};

export default TextInput;
