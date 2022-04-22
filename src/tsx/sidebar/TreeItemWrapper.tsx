import { alpha, styled } from '@mui/material';
import { TreeItem, treeItemClasses, TreeItemProps } from '@mui/lab';
import React from 'react';
import { useDispatch } from 'react-redux';
import { UUID } from '../state/ImageTypes';
import { setHoveringAction, setSelectionAction } from '../state/WorkStore';

const StyledTreeItem = styled((props: TreeItemProps) => <TreeItem {...props} />)(({ theme }) => ({
    [`& .${treeItemClasses.iconContainer}`]: {
        '& .close': {
            opacity: 0.3,
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 15,
        paddingLeft: 18,
        borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
    },
}));

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
