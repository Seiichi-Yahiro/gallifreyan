import * as React from 'react';
import SVGWord, {IWord} from './SVGWord';
import Group, {Unit} from './Group';

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
            selected: ''
        };
    }

    public render() {
        const {selectWord} = this;
        const {words} = this.props;
        const {selected} = this.state;

        return (
            <svg className="grid__svg" viewBox="0 0 1000 1000">
                <Group x={50} y={50} unit={Unit.PERCENT}>
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
        );
    }

    private selectWord = (id: string) => this.setState(() => ({selected: id}));
}

export default SVG;