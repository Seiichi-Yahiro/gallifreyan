import React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useRedux } from '../../hooks/useRedux';
import { ImageType, Consonant, Letter, UUID, Vocal } from '../../state/image/ImageTypes';
import { setHovering } from '../../state/work/WorkActions';
import DotTreeItem from './DotTreeItem';
import LineSlotTreeItem from './LineSlotTreeItem';
import TreeItem from './TreeItem';
import TreeItemContent from './TreeItemContent';

interface LetterTreeItemProps {
    id: UUID;
}

const LetterTreeItem: React.FunctionComponent<LetterTreeItemProps> = ({ id }) => {
    const letter = useRedux((state) => state.image.circles[id]) as Letter;

    if (letter.type === ImageType.Consonant) {
        return <ConsonantTreeItem id={letter.id} />;
    } else {
        return <VocalTreeItem id={letter.id} />;
    }
};

interface ConsonantTreeItemProps {
    id: UUID;
}

const ConsonantTreeItem: React.FunctionComponent<ConsonantTreeItemProps> = ({ id }) => {
    const dispatch = useAppDispatch();
    const consonant = useRedux((state) => state.image.circles[id]) as Consonant;

    const hasChildren = consonant.dots.length + consonant.lineSlots.length > 0;

    return (
        <TreeItem
            nodeId={consonant.id}
            label={consonant.text}
            ContentComponent={TreeItemContent}
            onMouseEnter={() => dispatch(setHovering(id))}
            onMouseLeave={() => dispatch(setHovering())}
        >
            {hasChildren && (
                <>
                    {consonant.dots.map((dotId) => (
                        <DotTreeItem key={dotId} id={dotId} />
                    ))}
                    {consonant.lineSlots.map((lineSlotId) => (
                        <LineSlotTreeItem key={lineSlotId} id={lineSlotId} />
                    ))}
                </>
            )}
        </TreeItem>
    );
};

interface VocalTreeItemProps {
    id: UUID;
}

const VocalTreeItem: React.FunctionComponent<VocalTreeItemProps> = ({ id }) => {
    const dispatch = useAppDispatch();
    const vocal = useRedux((state) => state.image.circles[id]) as Vocal;

    return (
        <TreeItem
            nodeId={vocal.id}
            label={vocal.text}
            ContentComponent={TreeItemContent}
            onMouseEnter={() => dispatch(setHovering(id))}
            onMouseLeave={() => dispatch(setHovering())}
        >
            {vocal.lineSlots.map((lineSlotId) => (
                <LineSlotTreeItem key={lineSlotId} id={lineSlotId} />
            ))}
        </TreeItem>
    );
};

export default React.memo(LetterTreeItem);
