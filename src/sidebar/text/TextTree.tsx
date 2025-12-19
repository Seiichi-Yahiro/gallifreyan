import { useRedux } from '@/redux/hooks';
import type {
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    WordId,
} from '@/redux/ids';
import { Tree, TreeItem } from '@/ui/Tree';
import cn from '@/utils/cn';
import useHover from '@/utils/useHover';
import useSelect from '@/utils/useSelect';
import React from 'react';

interface TextTreeProps {
    className?: string;
}

const TextTree: React.FC<TextTreeProps> = ({ className }) => {
    const root = useRedux((state) => state.text.rootElement);

    return (
        <Tree className={className}>
            {root && <TextSentenceTreeItem sentenceId={root} />}
        </Tree>
    );
};

interface TextSentenceTreeItemProps {
    sentenceId: SentenceId;
}

const TextSentenceTreeItem: React.FC<TextSentenceTreeItemProps> = ({
    sentenceId,
}) => {
    const { isHovered, onHover, onHoverStop } = useHover(sentenceId);
    const { isSelected, onSelect } = useSelect(sentenceId);

    const sentence = useRedux((state) => state.text.elements[sentenceId]);

    return (
        <TreeItem
            title={sentence.text}
            defaultOpen={true}
            onMouseEnter={onHover}
            onMouseLeave={onHoverStop}
            onClick={onSelect}
            className={cn({
                'bg-hover-accent': isHovered,
                'bg-hover-accent-strong': isSelected,
            })}
        >
            {sentence.words.map((word) => (
                <TextWordTreeItem key={word} wordId={word} />
            ))}
        </TreeItem>
    );
};

interface TextWordTreeItemProps {
    wordId: WordId;
}

const TextWordTreeItem: React.FC<TextWordTreeItemProps> = ({ wordId }) => {
    const { isHovered, onHover, onHoverStop } = useHover(wordId);
    const { isSelected, onSelect } = useSelect(wordId);

    const word = useRedux((state) => state.text.elements[wordId]);

    return (
        <TreeItem
            title={word.text}
            defaultOpen={true}
            onMouseEnter={onHover}
            onMouseLeave={onHoverStop}
            onClick={onSelect}
            className={cn({
                'bg-hover-accent': isHovered,
                'bg-hover-accent-strong': isSelected,
            })}
        >
            {word.letters.map((letter) => (
                <TextLetterTreeItem key={letter} letterId={letter} />
            ))}
        </TreeItem>
    );
};

interface TextLetterTreeItemProps {
    letterId: LetterId;
}

const TextLetterTreeItem: React.FC<TextLetterTreeItemProps> = ({
    letterId,
}) => {
    const { isHovered, onHover, onHoverStop } = useHover(letterId);
    const { isSelected, onSelect } = useSelect(letterId);

    const letter = useRedux((state) => state.text.elements[letterId]);

    return (
        <TreeItem
            title={letter.text}
            onMouseEnter={onHover}
            onMouseLeave={onHoverStop}
            onClick={onSelect}
            className={cn({
                'bg-hover-accent': isHovered,
                'bg-hover-accent-strong': isSelected,
            })}
        >
            {letter.dots.length > 0
                ? letter.dots.map((dot) => (
                      <TextDotTreeItem key={dot} dotId={dot} />
                  ))
                : letter.lineSlots.length > 0
                  ? letter.lineSlots.map((lineSlot) => (
                        <TextLineSlotTreeItem
                            key={lineSlot}
                            lineSlotId={lineSlot}
                        />
                    ))
                  : null}
        </TreeItem>
    );
};

interface TextDotTreeItemProps {
    dotId: DotId;
}

const TextDotTreeItem: React.FC<TextDotTreeItemProps> = ({ dotId }) => {
    const { isHovered, onHover, onHoverStop } = useHover(dotId);
    const { isSelected, onSelect } = useSelect(dotId);

    return (
        <TreeItem
            title="Dot"
            onMouseEnter={onHover}
            onMouseLeave={onHoverStop}
            onClick={onSelect}
            className={cn({
                'bg-hover-accent': isHovered,
                'bg-hover-accent-strong': isSelected,
            })}
        />
    );
};

interface TextLineSlotTreeItemProps {
    lineSlotId: LineSlotId;
}

const TextLineSlotTreeItem: React.FC<TextLineSlotTreeItemProps> = ({
    lineSlotId,
}) => {
    const { isHovered, onHover, onHoverStop } = useHover(lineSlotId);
    const { isSelected, onSelect } = useSelect(lineSlotId);

    return (
        <TreeItem
            title="Line-Slot"
            onMouseEnter={onHover}
            onMouseLeave={onHoverStop}
            onClick={onSelect}
            className={cn({
                'bg-hover-accent': isHovered,
                'bg-hover-accent-strong': isSelected,
            })}
        />
    );
};

export default TextTree;
