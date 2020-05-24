import React from 'react';
import { setHoveringAction, useRedux } from '../state/AppStore';
import { UUID } from '../state/StateTypes';
import { TreeView, TreeItem } from '@material-ui/lab';
import { ExpandMore, ChevronRight } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { isLetterConsonant } from '../utils/LetterGroups';
import Maybe from '../utils/Maybe';

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
                            {word.letters.map((letter) => (
                                <TreeItemWrapper
                                    key={letter.circleId}
                                    text={letter.text}
                                    circleId={letter.circleId}
                                    lineSlots={letter.lineSlots}
                                >
                                    {isLetterConsonant(letter) &&
                                        letter.dots.map((dot) => (
                                            <TreeItemWrapper key={dot} text="DOT" circleId={dot} lineSlots={[]} />
                                        ))}
                                </TreeItemWrapper>
                            ))}
                        </TreeItemWrapper>
                    ))}
                </TreeItemWrapper>
            ))}
        </TreeView>
    );
};

interface TreeItemProps {
    text: string;
    circleId: UUID;
    lineSlots: UUID[];
}

const TreeItemWrapper: React.FunctionComponent<TreeItemProps> = ({ text, circleId, lineSlots, children }) => {
    const dispatcher = useDispatch();
    const hasChildren = React.Children.count(children) > 0 || lineSlots.length > 0;

    return (
        <TreeItem
            nodeId={circleId}
            label={text}
            onMouseEnter={() => dispatcher(setHoveringAction(Maybe.some(circleId)))}
            onMouseLeave={() => dispatcher(setHoveringAction(Maybe.none()))}
        >
            {hasChildren && (
                <>
                    {children}
                    {lineSlots.map((slot) => (
                        <TreeItem
                            key={slot}
                            nodeId={slot}
                            label="LINE"
                            onMouseEnter={() => dispatcher(setHoveringAction(Maybe.some(slot)))}
                            onMouseLeave={() => dispatcher(setHoveringAction(Maybe.none()))}
                        />
                    ))}
                </>
            )}
        </TreeItem>
    );
};

export default Tree;
