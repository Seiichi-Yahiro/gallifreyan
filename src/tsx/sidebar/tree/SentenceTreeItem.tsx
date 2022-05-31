import React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useRedux } from '../../hooks/useRedux';
import { Sentence, UUID } from '../../state/image/ImageTypes';
import { setHovering } from '../../state/work/WorkActions';
import { selectSentence } from '../../state/work/WorkThunks';
import LineSlotTreeItem from './LineSlotTreeItem';
import TreeItem from './TreeItem';
import { createTreeItemContent } from './TreeItemContent';
import WordTreeItem from './WordTreeItem';

interface SentenceTreeItemProps {
    id: UUID;
}

const SentenceTreeItem: React.FunctionComponent<SentenceTreeItemProps> = ({ id }) => {
    const dispatch = useAppDispatch();
    const sentence = useRedux((state) => state.image.circles[id]) as Sentence;

    const hasChildren = sentence.words.length + sentence.lineSlots.length > 0;

    return (
        <TreeItem
            nodeId={sentence.id}
            label={sentence.text}
            ContentComponent={createTreeItemContent(selectSentence)}
            onMouseEnter={() => dispatch(setHovering(sentence.id))}
            onMouseLeave={() => dispatch(setHovering())}
        >
            {hasChildren && (
                <>
                    {sentence.words.map((letterID) => (
                        <WordTreeItem key={letterID} id={letterID} />
                    ))}
                    {sentence.lineSlots.map((lineSlotId) => (
                        <LineSlotTreeItem key={lineSlotId} id={lineSlotId} />
                    ))}
                </>
            )}
        </TreeItem>
    );
};

export default React.memo(SentenceTreeItem);
