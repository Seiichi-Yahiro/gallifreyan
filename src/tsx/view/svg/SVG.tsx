import * as React from 'react';
import SVGWord, {IWord} from './SVGWord';
import Group from './Group';
import {AutoSizer} from 'react-virtualized';
import {POSITION_LEFT, ReactSVGPanZoom} from 'react-svg-pan-zoom';

interface ISVGProps {
    words: IWord[];
}

interface ISVGState {
    selected: string;
}

class SVG extends React.Component<ISVGProps, ISVGState> {

    constructor(props: ISVGProps) {
        super(props);

        this.state = {
            selected: '',
        };
    }

    public render() {
        const {selectWord} = this;
        const {words} = this.props;
        const {selected} = this.state;
        return (
            <div className="grid__svg">
                <AutoSizer>
                    {({width, height}) => (
                        <ReactSVGPanZoom width={width} height={height} detectAutoPan={false} toolbarPosition={POSITION_LEFT}>
                            <svg width={1000} height={1000}>
                                <Group x={500} y={500}>
                                    <circle r={500} style={{stroke:'black',fill:'transparent'}} />
                                    {
                                        words.map((word: IWord) => (
                                            <SVGWord key={word.id}
                                                     word={word}
                                                     isSelected={word.id === selected}
                                                     onWordClick={selectWord}
                                            />)
                                        )
                                    }
                                </Group>
                            </svg>
                        </ReactSVGPanZoom>
                    )}
                </AutoSizer>
            </div>
        );
    }

    private selectWord = (id: string) => this.setState(() => ({selected: id}));
}

export default SVG;