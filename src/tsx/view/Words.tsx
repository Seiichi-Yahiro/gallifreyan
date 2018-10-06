import * as React from 'react';
import Button from '../component/Button';
import HorizontalRuler from '../component/HorizontalRuler';

const Words: React.SFC = () => {
    const addWord = () => {
        console.log('Add Word');
    };

    return (
        <div className="grid__sidebar words">
            <div>
                <Button text="Add Word" className="button--full-width" onClick={addWord} />
            </div>
            <HorizontalRuler/>
            <div className="words__content"/>
        </div>
    );
};

export default Words;