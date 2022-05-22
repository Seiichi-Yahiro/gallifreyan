import React from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useRedux } from '../hooks/useRedux';
import { Sentence } from '../state/ImageTypes';
import { setHovering } from '../state/WorkState';
import TreeItem from './TreeItem';
import { EditableTreeItemContent } from './TreeItemContent';
import WordTreeItem from './WordTreeItem';

interface SentenceTreeItemProps {}

const SentenceTreeItem: React.FunctionComponent<SentenceTreeItemProps> = () => {
    const dispatch = useAppDispatch();
    const sentence = useRedux((state) => state.image.circles[state.image.rootCircleId]) as Sentence | undefined;

    return (
        <TreeItem
            nodeId={sentence?.id ?? ''}
            label={sentence?.text ?? ''}
            ContentComponent={EditableTreeItemContent}
            onMouseEnter={() => dispatch(setHovering(sentence?.id))}
            onMouseLeave={() => dispatch(setHovering())}
        >
            {sentence?.words.map((wordId) => (
                <WordTreeItem key={wordId} id={wordId} />
            ))}
        </TreeItem>
    );
};

export default React.memo(SentenceTreeItem);
