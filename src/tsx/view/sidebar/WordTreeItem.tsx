import * as React from 'react';
import { useContext, useState } from 'react';
import { ILetter, ISVGBaseItem, IWord, SVGItemType } from '../../types/SVG';
import { createClassName } from '../../utils/ComponentUtils';
import TriangleIcon from '../../icon/TriangleIcon';
import XIcon from '../../icon/XIcon';
import { AppContextStateDispatch } from '../AppContext';
import useSelect from '../../hooks/useSelect';
import { removeSVGItemsAction } from '../../store/AppStore';

interface IWordTreeItemProps {
    svgItem: ISVGBaseItem;
}

const WordTreeItem: React.FunctionComponent<IWordTreeItemProps> = ({ svgItem }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const dispatch = useContext(AppContextStateDispatch);
    const { select, isSelected } = useSelect(svgItem);

    const deleteIcon = () => {
        const onXIconClick = () => dispatch(removeSVGItemsAction(svgItem));

        return (
            <div className="display-contents" onClick={onXIconClick}>
                <XIcon className="sidebar-word-tree__icon sidebar-word-tree__delete-icon" />
            </div>
        );
    };

    const toggleIcon = () => {
        const onToggleIconClick = () => setIsCollapsed(!isCollapsed);

        return (
            <div className="display-contents" onClick={onToggleIconClick}>
                <TriangleIcon
                    className={createClassName(
                        'sidebar-word-tree__toggle-icon',
                        `sidebar-word-tree__${svgItem.type}-toggle-icon`,
                        {
                            'sidebar-word-tree__toggle-icon--collapsed': isCollapsed
                        }
                    )}
                />
            </div>
        );
    };

    const itemClassName = createClassName('sidebar-word-tree__item', `sidebar-word-tree__${svgItem.type}-item`, {
        'sidebar-word-tree__item--selected': isSelected
    });

    const hasChildren = svgItem.children && svgItem.children.length > 0;

    return (
        <div className="display-contents">
            {hasChildren && toggleIcon()}
            <div className={itemClassName} onClick={select}>
                {(svgItem as IWord | ILetter).text || svgItem.type}
            </div>
            {svgItem.type !== SVGItemType.DOT && deleteIcon()}
            {hasChildren && !isCollapsed && (
                <div className="display-contents">
                    {svgItem.children!.map(child => (
                        <WordTreeItem svgItem={child} key={child.id} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default React.memo(WordTreeItem);
