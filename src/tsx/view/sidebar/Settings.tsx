import * as React from 'react';
import XIcon from '../../icon/XIcon';
import { ILetter, ISVGCircleItem, IWord } from '../../types/SVG';
import { isSVGCircleItem } from '../svg/utils/Utils';
import AppContext from '../AppContext';

class Settings extends React.Component {
    public static contextType = AppContext;
    public context!: React.ContextType<typeof AppContext>;

    public render() {
        const { getSVGCircleItemSettings } = this;
        const { selection } = this.context;

        return (
            <div className="sidebar__settings sidebar-settings">
                {isSVGCircleItem(selection!) ? getSVGCircleItemSettings(selection! as ISVGCircleItem) : undefined}
            </div>
        );
    }

    private getSVGCircleItemSettings = (svgItem: ISVGCircleItem) => {
        const { onChange, onXIconClick } = this;
        const { r, x, y } = svgItem;
        const hasText = (svgItem as IWord | ILetter).text !== undefined;

        return (
            <>
                {hasText && (
                    <>
                        <input
                            type="text"
                            className="text-input sidebar-settings__text-input"
                            value={(svgItem as IWord | ILetter).text}
                            onChange={onChange('text')}
                        />
                        <div className="display-contents" onClick={onXIconClick}>
                            <XIcon className="sidebar-settings__icon" />
                        </div>
                    </>
                )}
                <label htmlFor="word-radius" className="sidebar-settings__label">
                    Radius
                </label>
                <input
                    id="word-radius"
                    type="number"
                    className="number-input sidebar-settings__number-input"
                    min={1}
                    value={r}
                    onChange={onChange('r')}
                />
                <label htmlFor="word-x" className="sidebar-settings__label">
                    X-Position
                </label>
                <input
                    id="word-x"
                    type="number"
                    className="number-input sidebar-settings__number-input"
                    value={x}
                    onChange={onChange('x')}
                />
                <label htmlFor="word-y" className="sidebar-settings__label">
                    Y-Position
                </label>
                <input
                    id="word-y"
                    type="number"
                    className="number-input sidebar-settings__number-input"
                    value={y}
                    onChange={onChange('y')}
                />
            </>
        );
    };

    private onChange = (key: 'r' | 'x' | 'y' | 'text') => (event: React.ChangeEvent<HTMLInputElement>) => {
        const { selection, updateSVGItems } = this.context;
        let newValue: string | number = event.currentTarget.value;

        updateSVGItems(selection!, prevWord => {
            const oldValue = prevWord[key];

            if (typeof oldValue === 'number') {
                newValue = Number(newValue);
            }

            return {
                [key]: newValue
            };
        });
    };

    private onXIconClick = () => this.context.removeSVGItems(this.context.selection!);
}

export default Settings;
