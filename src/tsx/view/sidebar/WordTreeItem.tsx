import * as React from 'react';
import { ILetter, ISVGBaseItem, IWord, SVGItemType } from '../../types/SVG';
import { createClassName } from '../../component/ComponentUtils';
import TriangleIcon from '../../icon/TriangleIcon';
import XIcon from '../../icon/XIcon';
import AppContext from '../AppContext';

interface IWordTreeItemProps {
    svgItem: ISVGBaseItem;
}

interface IWordTreeItemState {
    isCollapsed: boolean;
}

class WordTreeItem extends React.Component<IWordTreeItemProps, IWordTreeItemState> {
    public static contextType = AppContext;
    public context!: React.ContextType<typeof AppContext>;

    constructor(props: IWordTreeItemProps) {
        super(props);

        this.state = {
            isCollapsed: true
        };
    }

    public render() {
        const { onClick, getDeleteIcon, getToggleIcon, createItemClassName } = this;
        const { isCollapsed } = this.state;
        const { svgItem } = this.props;
        const hasChildren = svgItem.children && svgItem.children.length > 0;

        return (
            <div className="display-contents">
                {hasChildren && getToggleIcon(svgItem)}
                <div className={createItemClassName(svgItem)} onClick={onClick}>
                    {(svgItem as IWord | ILetter).text || svgItem.type}
                </div>
                {svgItem.type !== SVGItemType.DOT && getDeleteIcon(svgItem)}
                {hasChildren && !isCollapsed && (
                    <div className="display-contents">
                        {svgItem.children!.map(child => (
                            <WordTreeItem svgItem={child} key={child.id} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    private onClick = () => this.context.select(this.props.svgItem);

    private getDeleteIcon = (svgItem: ISVGBaseItem) => (
        <div className="display-contents" onClick={this.onXIconClick(svgItem)}>
            <XIcon className="sidebar-word-tree__icon sidebar-word-tree__delete-icon" />
        </div>
    );

    private onXIconClick = (svgItem: ISVGBaseItem) => () => this.context.removeSVGItems(svgItem);

    private getToggleIcon = (svgItem: ISVGBaseItem) => (
        <div className="display-contents" onClick={this.onToggleIconClick}>
            <TriangleIcon
                className={createClassName(
                    'sidebar-word-tree__toggle-icon',
                    `sidebar-word-tree__${svgItem.type}-toggle-icon`,
                    {
                        'sidebar-word-tree__toggle-icon--collapsed': this.state.isCollapsed
                    }
                )}
            />
        </div>
    );

    private onToggleIconClick = () => this.setState(prevState => ({ isCollapsed: !prevState.isCollapsed }));

    private createItemClassName = (svgItem: ISVGBaseItem) =>
        createClassName('sidebar-word-tree__item', `sidebar-word-tree__${svgItem.type}-item`, {
            'sidebar-word-tree__item--selected': this.context.selection === svgItem
        });
}

export default WordTreeItem;
