import * as React from 'react';

export interface IWord {
    readonly id: string;
    text: string;
}

interface ISVGWordProps {
    word: IWord;
}

interface ISVGWordState {
    x: number;
    y: number;
}

class SVGWord extends React.Component<ISVGWordProps, ISVGWordState> {

    constructor(props: ISVGWordProps) {
        super(props);

        this.state = {
            x: 0,
            y: 0
        };
    }


    public render() {
        const {x, y} = this.state;

        return (
            <circle cx={x} cy={y} r={100}/>
        );
    }
}

export default SVGWord;