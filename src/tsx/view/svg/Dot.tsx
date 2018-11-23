import * as React from 'react';
import { ISVGCircleItem } from './SVG';

export interface IDot extends ISVGCircleItem {}

class Dot extends React.Component {
    public render() {
        return <circle />;
    }
}

export default Dot;
