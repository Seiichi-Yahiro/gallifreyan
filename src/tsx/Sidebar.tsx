import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { addSentenceAction } from './state/AppStore';

interface SidebarProps {}

const Sidebar: React.FunctionComponent<SidebarProps> = ({}) => {
    const [state, setState] = useState('');
    const dispatch = useDispatch();

    const addSentence = (sentence: string) => dispatch(addSentenceAction(sentence));

    const onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => setState(event.target.value);

    const onKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            addSentence(state);
        }
    };

    const onButtonPress = () => addSentence(state);

    return (
        <div className="app__sidebar">
            <div>
                <TextField
                    required={true}
                    placeholder="Sentence..."
                    value={state}
                    onChange={onTextChange}
                    onKeyPress={onKeyPress}
                />
                <Button variant="outlined" color="primary" onClick={onButtonPress}>
                    Add
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
