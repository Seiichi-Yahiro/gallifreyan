import React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useRedux } from '../../../hooks/useRedux';
import { Dot, UUID } from '../../../state/image/ImageTypes';
import { setHovering } from '../../../state/work/WorkActions';
import { selectDot } from '../../../state/work/WorkThunks';
import TreeItem from './TreeItem';
import { createTreeItemContent } from './TreeItemContent';

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
            ContentComponent={createTreeItemContent(selectDot)}
            onMouseEnter={() => dispatch(setHovering(id))}
            onMouseLeave={() => dispatch(setHovering())}
        />
    );
};

export default React.memo(DotTreeItem);
