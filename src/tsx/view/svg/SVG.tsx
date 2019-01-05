import * as React from 'react';
import Word from './Word';
import Group from './Group';
import { AutoSizer } from 'react-virtualized';
import { POSITION_LEFT, ReactSVGPanZoom, Value } from 'react-svg-pan-zoom';
import SVGContext, { defaultSVGContext, ISVGContext } from './SVGContext';
import { createRef } from 'react';
import { IWord } from '../../types/SVG';
import AppContext from '../AppContext';
import { isSVGCircleItem } from './utils/Utils';

class SVG extends React.Component<{}, ISVGContext> {
    public static contextType = AppContext;
    public context!: React.ContextType<typeof AppContext>;

    private reactSVGPanZoom = createRef<ReactSVGPanZoom>();

    constructor(props: {}) {
        super(props);

        this.state = {
            ...defaultSVGContext
        };
    }

    public componentDidMount() {
        setTimeout(() => this.reactSVGPanZoom.current!.fitToViewer());
    }

    public render() {
        const { onChangeSVGPanZoom, onWheel, deSelect, reactSVGPanZoom } = this;
        const { zoomX, zoomY } = this.state;
        const { words } = this.context;

        return (
            <div className="grid__svg">
                <AutoSizer>
                    {({ width, height }) => (
                        <ReactSVGPanZoom
                            width={width}
                            height={height}
                            detectAutoPan={false}
                            toolbarPosition={POSITION_LEFT}
                            onChangeValue={onChangeSVGPanZoom}
                            ref={reactSVGPanZoom}
                        >
                            <svg width={1010} height={1010}>
                                <SVGContext.Provider value={{ zoomX, zoomY }}>
                                    <Group x={505} y={505} onWheel={onWheel}>
                                        <circle r={500} onClick={deSelect} className="svg-sentence" />
                                        {words.map((word: IWord) => (
                                            <Word key={word.id} word={word} />
                                        ))}
                                    </Group>
                                </SVGContext.Provider>
                            </svg>
                        </ReactSVGPanZoom>
                    )}
                </AutoSizer>
            </div>
        );
    }

    private deSelect = () => this.context.select();

    private onWheel = (event: React.WheelEvent<SVGGElement>) => {
        const { selection, calculateAngles, updateSVGItems } = this.context;

        if (event.ctrlKey && selection) {
            const wheelDirection = -event.deltaY / Math.abs(event.deltaY);

            if (isSVGCircleItem(selection)) {
                updateSVGItems(selection, prevItem => ({
                    r: prevItem.r + wheelDirection
                }));

                calculateAngles(selection[0]);

                event.preventDefault();
                event.stopPropagation();
            }
        }
    };

    private onChangeSVGPanZoom = (value: Value) => {
        const { a, b, c, d } = value;

        this.setState({
            zoomX: Math.sqrt(a * a + c * c),
            zoomY: Math.sqrt(b * b + d * d)
        });
    };
}

export default SVG;
