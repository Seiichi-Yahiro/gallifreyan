import * as React from 'react';
import XIcon from '../../icon/XIcon';
import { createClassName } from '../../component/ComponentUtils';
import withContext from '../../hocs/WithContext';
import AppContext, { IAppContext } from '../AppContext';
import { IWord } from '../../types/SVG';

interface IOwnProps {
    word: IWord;
}

type ISidebarWordProps = IOwnProps & IAppContext;

interface ISidebarWordState {
    text: string;
    r: number;
    x: number;
    y: number;
}

class Word extends React.Component<ISidebarWordProps, ISidebarWordState> {
    constructor(props: ISidebarWordProps) {
        super(props);

        const { text, r, x, y } = props.word;

        this.state = {
            text,
            r,
            x,
            y
        };
    }

    public render() {
        const { select, onChange, onXIconClick } = this;
        const { text } = this.state;
        const { selection, word } = this.props;
        const isSelected = selection.length > 0 && selection[0] === word.id;
        const className = createClassName('sidebar-word', {
            'sidebar-word--selected': isSelected
        });

        return (
            <div className={className}>
                <input
                    type="text"
                    className="text-input sidebar-word__text-input"
                    value={text}
                    onChange={onChange('text')}
                    onClick={isSelected ? undefined : select}
                />

                <div className="display-contents" onClick={onXIconClick}>
                    <XIcon className="sidebar-word__icon" />
                </div>

                <div className="display-contents">
                    <label htmlFor="word-radius" className="sidebar-word__label">
                        Radius
                    </label>
                    <input
                        id="word-radius"
                        type="number"
                        className="number-input sidebar-word__number-input"
                        min={1}
                        value={word.r}
                        onChange={onChange('r')}
                    />

                    <label htmlFor="word-x" className="sidebar-word__label">
                        X-Position
                    </label>
                    <input
                        id="word-x"
                        type="number"
                        className="number-input sidebar-word__number-input"
                        value={word.x}
                        onChange={onChange('x')}
                    />

                    <label htmlFor="word-y" className="sidebar-word__label">
                        Y-Position
                    </label>
                    <input
                        id="word-y"
                        type="number"
                        className="number-input sidebar-word__number-input"
                        value={word.y}
                        onChange={onChange('y')}
                    />
                </div>
            </div>
        );
    }

    private select = () => {
        const { selection, select, word } = this.props;

        if (selection.length === 1 && selection[0] === word.id) {
            select();
        } else {
            select(word);
        }
    };

    private onChange = <K extends keyof ISidebarWordState>(key: K) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const { word, updateSVGItems } = this.props;
        let newValue: string | number = event.currentTarget.value;

        updateSVGItems(word, prevWord => {
            const oldValue = prevWord[key];

            if (typeof oldValue === 'number') {
                newValue = Number(newValue);
            }

            this.setState({ [key]: newValue } as Pick<ISidebarWordState, K>);

            return {
                [key]: newValue
            };
        });
    };

    private onXIconClick = () => this.props.removeSVGItems(this.props.word);
}

export default withContext(AppContext)(Word);
