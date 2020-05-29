import { createStyles, fade, Theme } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { TreeItem, TreeItemProps } from '@material-ui/lab';
import React from 'react';
import { useDispatch } from 'react-redux';
import { setHoveringAction, setSelectionAction } from '../state/AppStore';
import { UUID } from '../state/StateTypes';
import Maybe from '../utils/Maybe';

const StyledTreeItem = withStyles((theme: Theme) =>
    createStyles({
        iconContainer: {
            '& .close': {
                opacity: 0.3,
            },
        },
        group: {
            marginLeft: 7,
            paddingLeft: 18,
            borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
        },
    })
)((props: TreeItemProps) => <TreeItem {...props} />);

interface TreeItemWrapperProps {
    text: string;
    circleId: UUID;
    lineSlots: UUID[];
}

const TreeItemWrapper: React.FunctionComponent<TreeItemWrapperProps> = ({ text, circleId, lineSlots, children }) => {
    const dispatcher = useDispatch();
    const hasChildren = React.Children.toArray(children).length > 0 || lineSlots.length > 0;

    return (
        <StyledTreeItem
            nodeId={circleId}
            label={text}
            onLabelClick={(event) => {
                dispatcher(setSelectionAction(Maybe.some(circleId)));
                event.preventDefault();
            }}
            onMouseEnter={() => dispatcher(setHoveringAction(Maybe.some(circleId)))}
            onMouseLeave={() => dispatcher(setHoveringAction(Maybe.none()))}
        >
            {hasChildren && (
                <>
                    {children}
                    {lineSlots.map((slot) => (
                        <StyledTreeItem
                            key={slot}
                            nodeId={slot}
                            label="LINE"
                            onLabelClick={(event) => {
                                dispatcher(setSelectionAction(Maybe.some(slot)));
                                event.preventDefault();
                            }}
                            onMouseEnter={() => dispatcher(setHoveringAction(Maybe.some(slot)))}
                            onMouseLeave={() => dispatcher(setHoveringAction(Maybe.none()))}
                        />
                    ))}
                </>
            )}
        </StyledTreeItem>
    );
};

export default TreeItemWrapper;
