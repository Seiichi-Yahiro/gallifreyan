import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSentenceAction } from '../state/ImageStore';
import Tree from './Tree';
import { Box, Button, TextField } from '@material-ui/core';

interface SidebarProps {}

const Sidebar: React.FunctionComponent<SidebarProps> = ({}) => {
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
        <div className="app__sidebar">
            <Box display="flex" justifyContent="space-between">
                <TextField
                    type="text"
                    placeholder="Sentence..."
                    value={state}
                    onChange={onTextChange}
                    onKeyPress={onKeyPress}
                />
                <Button onClick={onButtonPress}>Add</Button>
            </Box>
            <Tree />
        </div>
    );
};

export default Sidebar;
