import React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useRedux } from '../../hooks/useRedux';
import { Sentence, UUID } from '../../state/image/ImageTypes';
import { setHovering } from '../../state/work/WorkActions';
import TreeItem from './TreeItem';
import { createTreeItemContent } from './TreeItemContent';
import WordTreeItem from './WordTreeItem';

interface SentenceTreeItemProps {
    id: UUID;
}

const SentenceTreeItem: React.FunctionComponent<SentenceTreeItemProps> = ({ id }) => {
    const dispatch = useAppDispatch();
    const sentence = useRedux((state) => state.image.circles[id]) as Sentence;

    return (
        <TreeItem
            nodeId={sentence.id}
            label={sentence.text}
            ContentComponent={createTreeItemContent(sentence.type)}
            onMouseEnter={() => dispatch(setHovering(sentence.id))}
            onMouseLeave={() => dispatch(setHovering())}
        >
            {sentence.words.map((wordId) => (
                <WordTreeItem key={wordId} id={wordId} />
            ))}
        </TreeItem>
    );
};

export default React.memo(SentenceTreeItem);
