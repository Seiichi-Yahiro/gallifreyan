import { Box, Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSentenceAction } from '../state/ImageStore';

interface SentenceInputProps {
    className?: string;
}

const SentenceInput: React.FunctionComponent<SentenceInputProps> = ({ className }) => {
    const [state, setState] = useState('');
    const dispatch = useDispatch();

    const addSentence = (sentence: string) => {
        dispatch(addSentenceAction(sentence));
        setState('');
    };

    const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => setState(event.target.value);

    const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            addSentence(state);
        }
    };

    const onButtonPress = () => addSentence(state);

    return (
        <Box display="flex" justifyContent="space-between" className={className}>
            <TextField
                type="text"
                placeholder="Sentence..."
                value={state}
                onChange={onTextChange}
                onKeyPress={onKeyPress}
            />
            <Button onClick={onButtonPress}>Add</Button>
        </Box>
    );
};

export default SentenceInput;
