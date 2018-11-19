import * as React from 'react';
import Word, { IWord } from './Word';
import Group from './Group';
import { AutoSizer } from 'react-virtualized';
import { POSITION_LEFT, ReactSVGPanZoom, Value } from 'react-svg-pan-zoom';
import SVGContext, { defaultSVGContext, ISVGContext } from './SVGContext';
import { ILetter } from './Letter';
import { createRef } from 'react';
import { IAppState } from '../../App';

export interface ISVGBaseItem {
    readonly id: string;
    text: string;
    x: number;
    y: number;
    r: number;
    isHovered: boolean;
    isDragging: boolean;
    children: Array<IWord | ILetter>;
}

export type SVGItem = IWord | ILetter;

interface ISVGProps {
    words: IWord[];
    selection: string[];
    addWord: (text: string) => void;
    updateSVGItems: (
        path: string[],
        update: (prevItem: SVGItem, prevState: IAppState) => SVGItem
    ) => void;
    removeWord: (wordId: string) => void;
    select: (path: string[]) => void;
    calculateAngles: (wordId: string) => () => void;
}

class SVG extends React.Component<ISVGProps, ISVGContext> {
    private reactSVGPanZoom = createRef<ReactSVGPanZoom>();

    constructor(props: ISVGProps) {
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
        const {
            words,
            selection,
            select,
            calculateAngles,
            updateSVGItems
        } = this.props;

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
                                            <Word
                                                key={word.id}
                                                word={word}
                                                selection={selection}
                                                select={select}
                                                updateSVGItems={updateSVGItems}
                                                calculateAngles={calculateAngles(
                                                    word.id
                                                )}
                                            />
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

    private onWheel = (event: React.WheelEvent<SVGGElement>) => {
        const { selection, calculateAngles, updateSVGItems } = this.props;

        if (event.ctrlKey && selection.length > 0) {
            const wheelDirection = -event.deltaY / Math.abs(event.deltaY);

            updateSVGItems(selection, prevItem => ({
                ...prevItem,
                r: prevItem.r + wheelDirection
            }));

            calculateAngles(selection[0])();

            event.preventDefault();
            event.stopPropagation();
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
