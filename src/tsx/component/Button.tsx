import * as React from 'react';

interface IButtonProps {
    readonly text: string;
    readonly onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    readonly className?: string;
}

const Button: React.FunctionComponent<IButtonProps> = ({ text, onClick, className = '' }) => (
    <button className={`button ${className}`} type="button" onClick={onClick}>
        {text}
    </button>
);

export default React.memo(Button);
