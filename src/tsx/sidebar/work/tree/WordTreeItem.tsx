import React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useRedux } from '../../../hooks/useRedux';
import { UUID, Word } from '../../../state/image/ImageTypes';
import { setHovering } from '../../../state/work/WorkActions';
import { selectWord } from '../../../state/work/WorkThunks';
import LineSlotTreeItem from './LineSlotTreeItem';
import TreeItem from './TreeItem';
import { createTreeItemContent } from './TreeItemContent';
import LetterTreeItem from './LetterTreeItem';

interface WordTreeItemProps {
    id: UUID;
}

const WordTreeItemProps: React.FunctionComponent<WordTreeItemProps> = ({ id }) => {
    const dispatch = useAppDispatch();
    const word = useRedux((state) => state.image.circles[id]) as Word;

    const hasChildren = word.letters.length + word.lineSlots.length > 0;

    return (
        <TreeItem
            nodeId={word.id}
            label={word.text}
            ContentComponent={createTreeItemContent(selectWord)}
            onMouseEnter={() => dispatch(setHovering(id))}
            onMouseLeave={() => dispatch(setHovering())}
        >
            {hasChildren && (
                <>
                    {word.letters.map((letterID) => (
                        <LetterTreeItem key={letterID} id={letterID} />
                    ))}
                    {word.lineSlots.map((lineSlotId) => (
                        <LineSlotTreeItem key={lineSlotId} id={lineSlotId} />
                    ))}
                </>
            )}
        </TreeItem>
    );
};

export default React.memo(WordTreeItemProps);
