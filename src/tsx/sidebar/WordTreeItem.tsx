import React from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useRedux } from '../hooks/useRedux';
import { UUID, Word } from '../state/image/ImageTypes';
import { setHovering } from '../state/work/WorkActions';
import TreeItem from './TreeItem';
import { TreeItemContent } from './TreeItemContent';
import LetterTreeItem from './TreeItemLetter';

interface WordTreeItemProps {
    id: UUID;
}

const WordTreeItemProps: React.FunctionComponent<WordTreeItemProps> = ({ id }) => {
    const dispatch = useAppDispatch();
    const word = useRedux((state) => state.image.circles[id]) as Word;

    return (
        <TreeItem
            nodeId={word.id}
            label={word.text}
            ContentComponent={TreeItemContent}
            onMouseEnter={() => dispatch(setHovering(id))}
            onMouseLeave={() => dispatch(setHovering())}
        >
            {word.letters.map((letterID) => (
                <LetterTreeItem key={letterID} id={letterID} />
            ))}
        </TreeItem>
    );
};

export default React.memo(WordTreeItemProps);
