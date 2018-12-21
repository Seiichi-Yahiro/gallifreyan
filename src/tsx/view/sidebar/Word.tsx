import * as React from 'react';
import { IWord } from '../svg/Word';
import XIcon from '../../icon/XIcon';
import Flex from '../../component/Flex';
import { UpdateSVGItems } from '../../App';

interface ISidebarWordProps {
    word: IWord;
    updateSVGItems: UpdateSVGItems;
    onWordRemove: (id: string) => void;
}

interface ISidebarWordState {
    text: string;
}

class Word extends React.Component<ISidebarWordProps, ISidebarWordState> {
    constructor(props: ISidebarWordProps) {
        super(props);

        this.state = {
            text: props.word.text
        };
    }

    public render() {
        const { onTextChange, onXIconClick } = this;
        const { text } = this.state;

        return (
            <div>
                <Flex
                    isHorizontal={true}
                    spaceBetween={true}
                    verticalCenter={true}
                >
                    <input
                        type="text"
                        className="text-input"
                        value={text}
                        onChange={onTextChange}
                    />
                    <span
                        style={{ display: 'contents' }}
                        onClick={onXIconClick}
                    >
                        <XIcon />
                    </span>
                </Flex>
            </div>
        );
    }

    private onTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const text = event.currentTarget.value;
        this.setState({ text });

        const { word, updateSVGItems } = this.props;

        updateSVGItems<IWord>([word.id], prevWord => ({
            ...prevWord,
            text
        }));
    };

    private onXIconClick = () => this.props.onWordRemove(this.props.word.id);
}

export default Word;
