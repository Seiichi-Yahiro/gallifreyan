import * as React from 'react';
import { IIconProps } from './BaseIcon';

import { createClassName } from '../utils/ComponentUtils';

const TriangleIcon: React.FunctionComponent<IIconProps> = ({ className }) => (
    <svg className={createClassName('svg', className)}>
        <path d="M0 20 L20 20 L10 0 Z" />
    </svg>
);

export default TriangleIcon;
