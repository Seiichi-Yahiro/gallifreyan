import * as React from 'react';
import Group from './Group';
import {partialCircle} from './SVGUtils';
import {classNames} from '../../component/ComponentUtils';

export enum LetterGroups {
    DEEP_CUT = 'b|ch|d|h|f',
    SHALLOW_CUT = 'j|k|l|n|p|m',
    INSIDE = 't|sh|r|v|w|s',
    ON_LINE = 'th|y|z|qu|x|ng',
    DOUBLE_LETTERS = 'ch|sh|th|qu|ng',
}

export interface ILetter {
    readonly id: string;
    text: string;
    x: number;
    y: number;
    r: number;
    anglesOfLetter?: number[];
    anglesOfWord?: number[];
}

interface ISVGLetterProps {
    letter: ILetter;
    selection: string;
    select: (id: string) => void;
}

interface ISVGLetterState {
    isHovered: boolean;
}

class SVGLetter extends React.Component<ISVGLetterProps, ISVGLetterState> {

    constructor(props: ISVGLetterProps) {
        super(props);

        this.state = {
            isHovered: false,
        };
    }

    public render() {

        const {getPartialCircle, onMouseEnter, onMouseLeave, onClick} = this;
        const {letter, selection} = this.props;
        const {x, y, r, anglesOfLetter, id} = letter;
        const isSelected = id === selection;
        const {isHovered} = this.state;

        const groupClassNames = classNames([
            'svg-letter',
            isSelected ? 'svg-letter--is-selected' : '',
            isHovered ? 'svg-letter--is-hovered' : '',
        ]);

        return (
            <Group
                x={x}
                y={y}
                className={groupClassNames}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
            >
                {anglesOfLetter
                    ? getPartialCircle()
                    : <circle r={r}/>
                }

            </Group>
        );
    }

    private getPartialCircle = () => {
        const {anglesOfLetter, r} = this.props.letter;

        if (anglesOfLetter) {
            const [start, end] = anglesOfLetter;

            return <path d={partialCircle(0, 0, r, start < end ? start + 2 * Math.PI : start, end)}/>;
        }

        return undefined;
    };

    private onMouseEnter = (event: React.MouseEvent<SVGGElement>) => {
        this.setState(() => ({isHovered: true}));
        event.preventDefault();
    };

    private onMouseLeave = (event: React.MouseEvent<SVGGElement>) => {
        this.setState(() => ({isHovered: false}));
        event.preventDefault();
    };

    private onClick = () => this.props.select(this.props.letter.id);
}

export default SVGLetter;