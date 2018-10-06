import * as React from 'react';

interface IButtonProps {
    readonly text: string;
    readonly onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    readonly className?: string;
}

const Button: React.SFC<IButtonProps> = ({text, onClick, className = ''}) => (
    <button className={`button ${className}`} type="button" onClick={onClick}>{text}</button>
);

export default Button;