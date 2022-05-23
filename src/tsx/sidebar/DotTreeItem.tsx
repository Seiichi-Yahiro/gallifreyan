import React from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useRedux } from '../hooks/useRedux';
import { Dot, UUID } from '../state/image/ImageTypes';
import { setHovering } from '../state/work/WorkActions';
import TreeItem from './TreeItem';
import { TreeItemContent } from './TreeItemContent';

interface DotTreeItemProps {
    id: UUID;
}

const DotTreeItem: React.FunctionComponent<DotTreeItemProps> = ({ id }) => {
    const dispatch = useAppDispatch();
    const dot = useRedux((state) => state.image.circles[id]) as Dot;

    return (
        <TreeItem
            nodeId={dot.id}
            label="DOT"
            ContentComponent={TreeItemContent}
            onMouseEnter={() => dispatch(setHovering(id))}
            onMouseLeave={() => dispatch(setHovering())}
        />
    );
};

export default React.memo(DotTreeItem);
