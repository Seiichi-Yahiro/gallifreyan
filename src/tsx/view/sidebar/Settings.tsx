import * as React from 'react';
import { useContext } from 'react';
import XIcon from '../../icon/XIcon';
import { ILetter, ISVGBaseItem, ISVGCircleItem, IWord } from '../../types/SVG';
import { isSVGCircleItem } from '../../utils/Utils';
import { AppContextStateDispatch } from '../AppContext';
import { removeSVGItemsAction, updateSVGItemsAction } from '../../store/AppStore';

interface ISettingsProps {
    selectedItem: ISVGBaseItem;
}

const Settings: React.FunctionComponent<ISettingsProps> = ({ selectedItem }) => {
    const dispatch = useContext(AppContextStateDispatch);

    const onChange = (key: 'r' | 'x' | 'y' | 'text') => (event: React.ChangeEvent<HTMLInputElement>) => {
        let newValue: string | number = event.currentTarget.value;

        dispatch(
            updateSVGItemsAction(selectedItem, prevWord => {
                const oldValue = prevWord[key];

                if (typeof oldValue === 'number') {
                    newValue = Number(newValue);
                }

                return {
                    [key]: newValue
                };
            })
        );
    };

    const onXIconClick = () => dispatch(removeSVGItemsAction(selectedItem));

    const getSVGCircleItemSettings = (svgItem: ISVGCircleItem) => {
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

    return (
        <div className="sidebar__settings sidebar-settings">
            {isSVGCircleItem(selectedItem) ? getSVGCircleItemSettings(selectedItem) : undefined}
        </div>
    );
};

export default React.memo(Settings);
