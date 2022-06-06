import React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useRedux } from '../../../hooks/useRedux';
import { UUID } from '../../../state/image/ImageTypes';
import { setHovering } from '../../../state/work/WorkActions';
import { selectLineSlot } from '../../../state/work/WorkThunks';
import TreeItem from './TreeItem';
import { createTreeItemContent } from './TreeItemContent';

interface LineSlotTreeItemProps {
    id: UUID;
}

const LineSlotTreeItemProps: React.FunctionComponent<LineSlotTreeItemProps> = ({ id }) => {
    const dispatch = useAppDispatch();
    const lineSlot = useRedux((state) => state.image.lineSlots[id])!;

    return (
        <TreeItem
            nodeId={lineSlot.id}
            label="LINE"
            ContentComponent={createTreeItemContent(selectLineSlot)}
            onMouseEnter={() => dispatch(setHovering(id))}
            onMouseLeave={() => dispatch(setHovering())}
        />
    );
};

export default React.memo(LineSlotTreeItemProps);
