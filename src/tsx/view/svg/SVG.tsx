import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Word from './Word';
import Group from './Group';
import { AutoSizer } from 'react-virtualized';
import { POSITION_LEFT, ReactSVGPanZoom, Value } from 'react-svg-pan-zoom';
import SVGContext, { defaultSVGContext } from './SVGContext';
import { IWord } from '../../types/SVG';
import { AppContextStateDispatch, AppContextStateSelection, AppContextStateWords } from '../AppContext';
import { isSVGCircleItem } from '../../utils/Utils';
import { selectAction, updateSVGItemsAction } from '../../store/AppStore';
import { getSVGItem } from '../../store/StateUtils';

const SVG: React.FunctionComponent = () => {
    const [svgContext, setSVGContext] = useState(defaultSVGContext);
    const dispatch = useContext(AppContextStateDispatch);
    const selection = useContext(AppContextStateSelection);
    const words = useContext(AppContextStateWords);

    const reactSVGPanZoom = useRef<ReactSVGPanZoom>(null);

    useEffect(() => {
        setTimeout(() => reactSVGPanZoom.current!.fitToViewer());
    }, []);

    const deSelect = useCallback(() => dispatch(selectAction()), []);

    // it doesn't matter if the words change
    const selectedItem = useMemo(() => (selection.length !== 0 ? getSVGItem(selection, words) : undefined), [
        selection
    ]);

    const onWheel = useCallback(
        (event: React.WheelEvent<SVGGElement>) => {
            if (event.ctrlKey && selectedItem) {
                const wheelDirection = -event.deltaY / Math.abs(event.deltaY);

                if (isSVGCircleItem(selectedItem)) {
                    dispatch(
                        updateSVGItemsAction(selectedItem, prevItem => ({
                            r: prevItem.r + wheelDirection
                        }))
                    );

                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        },
        [selection]
    );

    const onChangeSVGPanZoom = useCallback(
        ({ a, b, c, d }: Value) =>
            setSVGContext({
                zoomX: Math.sqrt(a * a + c * c),
                zoomY: Math.sqrt(b * b + d * d)
            }),
        []
    );

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
                            <SVGContext.Provider value={svgContext}>
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
};

export default SVG;
