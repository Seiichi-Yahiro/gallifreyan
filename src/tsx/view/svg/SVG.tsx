import * as React from 'react';
import SVGWord, { IWord } from './SVGWord';
import Group from './Group';
import { AutoSizer } from 'react-virtualized';
import { POSITION_LEFT, ReactSVGPanZoom, Value } from 'react-svg-pan-zoom';
import SVGContext, { defaultSVGContext, ISVGContext } from './SVGContext';
import { ILetter } from './SVGLetter';

interface ISVGProps {
    words: IWord[];
    selection: string[];
    addWord: (text: string) => void;
    updateWord: (
        wordId: string
    ) => (updateState: (prevWord: IWord) => IWord) => void;
    removeWord: (wordId: string) => void;
    select: (path: string[]) => void;
    updateLetters: (
        wordId: string
    ) => (updateState: (prevLetters: ILetter[]) => ILetter[]) => void;
    calculateAngles: (wordId: string) => () => void;
}

class SVG extends React.Component<ISVGProps, ISVGContext> {
    constructor(props: ISVGProps) {
        super(props);

        this.state = {
            ...defaultSVGContext
        };
    }

    public render() {
        const { onChangeSVGPanZoom, onWheel, deSelect } = this;
        const { zoomX, zoomY } = this.state;
        const {
            words,
            selection,
            select,
            updateWord,
            updateLetters,
            calculateAngles
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
                                            <SVGWord
                                                key={word.id}
                                                word={word}
                                                selection={selection}
                                                select={select}
                                                updateWord={updateWord(word.id)}
                                                updateLetters={updateLetters(
                                                    word.id
                                                )}
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
        const {
            words,
            selection,
            updateWord,
            updateLetters,
            calculateAngles
        } = this.props;

        if (event.ctrlKey && selection.length > 0) {
            const wheelDirection = -event.deltaY / Math.abs(event.deltaY);
            const selectedWord = words.find(word => word.id === selection[0]);

            if (selectedWord) {
                if (selection.length > 1) {
                    updateLetters(selectedWord.id)(prevLetters =>
                        prevLetters.map(letter => {
                            if (letter.id === selection[1]) {
                                return {
                                    ...letter,
                                    r: letter.r + wheelDirection
                                };
                            }
                            return letter;
                        })
                    );
                } else {
                    updateWord(selectedWord.id)(prevWord => ({
                        ...prevWord,
                        r: prevWord.r + wheelDirection
                    }));
                }
                calculateAngles(selectedWord.id)();
            }

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
