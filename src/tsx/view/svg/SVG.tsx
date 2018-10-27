import * as React from 'react';
import SVGWord, {IWord} from './SVGWord';
import Group from './Group';
import {AutoSizer} from 'react-virtualized';
import {POSITION_LEFT, ReactSVGPanZoom, Value} from 'react-svg-pan-zoom';
import SVGContext, {defaultSVGContext, ISVGContext} from './SVGContext';

interface ISVGProps {
    words: IWord[];
}

interface ISVGState extends ISVGContext {
    selected: string;
}

class SVG extends React.Component<ISVGProps, ISVGState> {
    constructor(props: ISVGProps) {
        super(props);

        this.state = {
            ...defaultSVGContext,
            selected: '',
        };
    }

    public render() {
        const {selectWord, onChangeSVGPanZoom} = this;
        const {words} = this.props;
        const {selected, zoomX, zoomY} = this.state;

        return (
            <div className="grid__svg">
                <AutoSizer>
                    {({width, height}) => (
                        <ReactSVGPanZoom
                            width={width}
                            height={height}
                            detectAutoPan={false}
                            toolbarPosition={POSITION_LEFT}
                            onChangeValue={onChangeSVGPanZoom}
                        >
                            <svg width={1010} height={1010}>
                                <SVGContext.Provider value={{zoomX, zoomY}}>
                                    <Group x={505} y={505}>
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
                                </SVGContext.Provider>
                            </svg>
                        </ReactSVGPanZoom>
                    )}
                </AutoSizer>
            </div>
        );
    }

    private onChangeSVGPanZoom = (value: Value) => {
        const {a, b, c, d} = value;

        this.setState({
            zoomX: Math.sqrt(a * a + c * c),
            zoomY: Math.sqrt(b * b + d * d)
        });
    };

    private selectWord = (id: string) => this.setState(() => ({selected: id}));
}

export default SVG;