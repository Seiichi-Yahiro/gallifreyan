import React from 'react';
import { useRedux } from '../state/AppStore';
import { TreeView } from '@material-ui/lab';
import { ExpandMore, ChevronRight } from '@material-ui/icons';
import { isLetterConsonant } from '../utils/LetterGroups';
import TreeItemWrapper from './TreeItemWrapper';

interface TreeProps {}

const Tree: React.FunctionComponent<TreeProps> = ({}) => {
    const sentences = useRedux((state) => state.sentences);

    return (
        <TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />}>
            {sentences.map((sentence) => (
                <TreeItemWrapper
                    key={sentence.circleId}
                    text={sentence.text}
                    circleId={sentence.circleId}
                    lineSlots={sentence.lineSlots}
                >
                    {sentence.words.map((word) => (
                        <TreeItemWrapper
                            key={word.circleId}
                            text={word.text}
                            circleId={word.circleId}
                            lineSlots={word.lineSlots}
                        >
                            {word.letters.map((letter) =>
                                isLetterConsonant(letter) ? (
                                    <TreeItemWrapper
                                        key={letter.circleId}
                                        text={letter.vocal
                                            .map((vocal) => letter.text + vocal.text)
                                            .unwrapOr(letter.text)}
                                        circleId={letter.circleId}
                                        lineSlots={letter.lineSlots}
                                    >
                                        {letter.dots.map((dot) => (
                                            <TreeItemWrapper key={dot} text="DOT" circleId={dot} lineSlots={[]} />
                                        ))}
                                        {letter.vocal
                                            .map((vocal) => (
                                                <TreeItemWrapper
                                                    key={vocal.circleId}
                                                    text={vocal.text}
                                                    circleId={vocal.circleId}
                                                    lineSlots={vocal.lineSlots}
                                                />
                                            ))
                                            .asNullable()}
                                    </TreeItemWrapper>
                                ) : (
                                    <TreeItemWrapper
                                        key={letter.circleId}
                                        text={letter.text}
                                        circleId={letter.circleId}
                                        lineSlots={letter.lineSlots}
                                    />
                                )
                            )}
                        </TreeItemWrapper>
                    ))}
                </TreeItemWrapper>
            ))}
        </TreeView>
    );
};

export default Tree;
