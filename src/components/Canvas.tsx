import * as React from 'react';
import {v4} from 'uuid';
import {Vector} from '../utils/canvasUtils';
import Word from './Word';

interface ICanvasProps {
    text: string;
}

interface ICanvasState {
    size: number;
}

class Canvas extends React.Component<ICanvasProps, ICanvasState> {
    private TWO_PI = Math.PI * 2;

    constructor(props: ICanvasProps) {
        super(props);

        this.state = {
          size: 800
        };
    }

    public render() {
        const {size} = this.state;
        const sizeStyle = {
            height: size,
            width: size
        };
        const center = size / 2;
        const words = this.props.text.split(' ').filter((word: string) => word.length > 0);
        const radians = this.TWO_PI / words.length;
        const initialVector = new Vector(0, center / 2);
        const translationToCenter = new Vector(center, center);

        return (
            <div style={{...sizeStyle, marginTop: 10}}>
                <svg style={{...sizeStyle, position: 'relative', border: '1px solid black'}}>
                    <circle cx={center} cy={center} r={center} stroke="black" strokeWidth="1" fill="transparent"/>
                    {words.map((word: string, index: number) => {
                        const translation = initialVector.rotate(radians * index).add(translationToCenter);
                        return (<Word key={v4()} word={word} initX={translation.x} initY={translation.y}/>);
                    })}
                </svg>
            </div>
        );
    }
}

export default Canvas;