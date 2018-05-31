import * as React from 'react';

interface IWordProps {
    word: string;
    initX: number;
    initY: number;
}

interface IWordState {
    x: number;
    y: number;
}

class Word extends React.Component<IWordProps, IWordState> {
    constructor(props: IWordProps) {
        super(props);

        this.state = {
            x: props.initX,
            y: props.initY
        };
    }

    public render() {
        const {x, y} =  this.state;
        const {word} = this.props;

        return(
            <g style={{position: 'relative'}} transform={`translate(${x}, ${y})`}>
                <circle r={word.length * 5} stroke="black" strokeWidth="1" fill="transparent"/>
            </g>
        );
    }
}

export default Word;