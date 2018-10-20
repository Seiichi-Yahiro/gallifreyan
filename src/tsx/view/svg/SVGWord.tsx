import * as React from 'react';
import {partialCircle} from './SVGUtils';
import {CSSProperties} from 'react';
import Group from './Group';
import {classNames} from '../../component/ComponentUtils';

export interface IWord {
    readonly id: string;
    text: string;
}

interface ISVGWordProps {
    word: IWord;
    isSelected: boolean;
    onWordClick: (id: string) => void;
}

interface ISVGWordState {
    x: number;
    y: number;
    isHovered: boolean;
}

class SVGWord extends React.Component<ISVGWordProps, ISVGWordState> {

    constructor(props: ISVGWordProps) {
        super(props);

        this.state = {
            x: 0,
            y: 0,
            isHovered: false,
        };
    }

    public render() {
        const {onMouseEnter, onMouseLeave, onClick} = this;
        const {x, y, isHovered} = this.state;
        const {isSelected} = this.props;
        const pathStyle: CSSProperties = {
            fill: 'transparent',
            strokeWidth: 1,
            stroke: 'inherit'
        };

        const groupClassNames = classNames([
            'svg-word',
            isSelected ? 'svg-word--is-selected' : '',
            isHovered ? 'svg-word--is-hovered' : ''
        ]);

        return (
            <Group x={x} y={y} className={groupClassNames} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick}>
                <path d={partialCircle(0, 0, 50, 0, 2 * Math.PI)} style={pathStyle}/>
            </Group>
        );
    }

    private onMouseEnter = () => this.setState(() => ({isHovered: true}));
    private onMouseLeave = () => this.setState(() => ({isHovered: false}));
    private onClick = () => this.props.onWordClick(this.props.word.id);
}

export default SVGWord;