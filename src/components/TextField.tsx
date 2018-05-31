import * as React from 'react';
import {CSSProperties} from 'react';

interface ITextFieldProps {
    onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const TextField: React.StatelessComponent<ITextFieldProps> = ({onChange}) => {
    const style: CSSProperties = {
        borderColor: '#000000',
        borderWidth: '0 0 1px 0',
        fontFamily: 'arial',
        outline: 0,
        padding: '0 4px 2px'
    };

    return (
        <input type="text" onChange={onChange} style={style}/>
    );
};

export default TextField;