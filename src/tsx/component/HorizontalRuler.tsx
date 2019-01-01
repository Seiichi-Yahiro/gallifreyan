import * as React from 'react';
import { createClassName } from './ComponentUtils';

interface IHorizontalRulerProps {
    className?: string;
}

const HorizontalRuler: React.FunctionComponent<IHorizontalRulerProps> = ({ className }) => (
    <hr className={createClassName('hr', className)} />
);

export default HorizontalRuler;
