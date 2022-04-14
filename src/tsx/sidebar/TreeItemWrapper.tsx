import { createStyles, alpha, Theme } from '@mui/material';
import { withStyles } from 'tss-react/mui';
import { TreeItem } from '@mui/lab';
import React from 'react';
import { useDispatch } from 'react-redux';
import { UUID } from '../state/ImageTypes';
import { setHoveringAction, setSelectionAction } from '../state/WorkStore';

const StyledTreeItem = withStyles(TreeItem, (theme: Theme) =>
    createStyles({
        iconContainer: {
            '& .close': {
                opacity: 0.3,
            },
        },
        group: {
            marginLeft: 7,
            paddingLeft: 18,
            borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
        },
    })
);

interface TreeItemWrapperProps {
    text: string;
    circleId: UUID;
    lineSlots: UUID[];
    children?: React.ReactNode;
}

const TreeItemWrapper: React.FunctionComponent<TreeItemWrapperProps> = ({ text, circleId, lineSlots, children }) => {
    const dispatcher = useDispatch();
    const hasChildren = React.Children.toArray(children).length > 0 || lineSlots.length > 0;

    return (
        <StyledTreeItem
            nodeId={circleId}
            label={text}
            onClick={(event) => {
                dispatcher(setSelectionAction(circleId));
                event.preventDefault();
            }}
            onMouseEnter={() => dispatcher(setHoveringAction(circleId))}
            onMouseLeave={() => dispatcher(setHoveringAction())}
        >
            {hasChildren && (
                <>
                    {children}
                    {lineSlots.map((slot) => (
                        <StyledTreeItem
                            key={slot}
                            nodeId={slot}
                            label="LINE"
                            onClick={(event) => {
                                dispatcher(setSelectionAction(slot));
                                event.preventDefault();
                            }}
                            onMouseEnter={() => dispatcher(setHoveringAction(slot))}
                            onMouseLeave={() => dispatcher(setHoveringAction())}
                        />
                    ))}
                </>
            )}
        </StyledTreeItem>
    );
};

export default TreeItemWrapper;
