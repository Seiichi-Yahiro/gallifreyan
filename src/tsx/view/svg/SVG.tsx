import * as React from 'react';
import Word from './Word';
import Group from './Group';
import { AutoSizer } from 'react-virtualized';
import { POSITION_LEFT, ReactSVGPanZoom, Value } from 'react-svg-pan-zoom';
import SVGContext, { defaultSVGContext, ISVGContext } from './SVGContext';
import { createRef } from 'react';
import AppContext, { IAppContext } from '../AppContext';
import withContext from '../../hocs/WithContext';
import { getSVGItem } from './utils/Utils';
import { ISVGBaseItem, ISVGCircleItem, IWord } from '../../types/SVG';

class SVG extends React.Component<IAppContext, ISVGContext> {
    private reactSVGPanZoom = createRef<ReactSVGPanZoom>();

    constructor(props: IAppContext) {
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
        const { words } = this.props;

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
                                        <circle
                                            r={500}
                                            onClick={deSelect}
                                            className="svg-sentence"
                                        />
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

    private deSelect = () => this.props.select([]);

    private isSVGCircleItem = (
        svgBaseItem: ISVGBaseItem
    ): svgBaseItem is ISVGCircleItem =>
        (svgBaseItem as ISVGCircleItem).r !== undefined;

    private onWheel = (event: React.WheelEvent<SVGGElement>) => {
        const {
            selection,
            calculateAngles,
            updateSVGItems,
            words
        } = this.props;

        if (event.ctrlKey && selection.length > 0) {
            const wheelDirection = -event.deltaY / Math.abs(event.deltaY);
            const svgItem = getSVGItem(selection, words);

            if (this.isSVGCircleItem(svgItem)) {
                updateSVGItems(svgItem, prevItem => ({
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

export default withContext(AppContext)(SVG);
