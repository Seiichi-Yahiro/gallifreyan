import { useRedux } from '@/redux/hooks';
import type {
    DotId,
    LetterId,
    LineSlotId,
    SentenceId,
    WordId,
} from '@/redux/text/ids';
import { Tree, TreeItem } from '@/ui/Tree';
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
    const sentence = useRedux((state) => state.text.elements[sentenceId]!);

    return (
        <TreeItem title={sentence.text} defaultOpen={true}>
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
    const word = useRedux((state) => state.text.elements[wordId]!);

    return (
        <TreeItem title={word.text} defaultOpen={true}>
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
    const letter = useRedux((state) => state.text.elements[letterId]!);

    return (
        <TreeItem title={letter.text}>
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

const TextDotTreeItem: React.FC<TextDotTreeItemProps> = () => {
    return <TreeItem title="Dot" />;
};

interface TextLineSlotTreeItemProps {
    lineSlotId: LineSlotId;
}

const TextLineSlotTreeItem: React.FC<TextLineSlotTreeItemProps> = () => {
    return <TreeItem title="Line-Slot" />;
};

export default React.memo(TextTree);
