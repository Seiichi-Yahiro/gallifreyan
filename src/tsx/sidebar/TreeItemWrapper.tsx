import { alpha, TextField, styled, Typography } from '@mui/material';
import { TreeItem, treeItemClasses, TreeItemContentProps, TreeItemProps, useTreeItem } from '@mui/lab';
import React from 'react';
import { useDispatch } from 'react-redux';
import { updateSentenceAction } from '../state/ImageStore';
import { UUID } from '../state/ImageTypes';
import { setHoveringAction, setSelectionAction } from '../state/WorkStore';
import createClassName from '../utils/createClassName';

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
    editable?: boolean;
    children?: React.ReactNode;
}

const createTreeItemContent =
    (editable: boolean) =>
    (
        { icon, expansionIcon, displayIcon, className, classes, nodeId, label }: TreeItemContentProps,
        ref: React.Ref<HTMLDivElement>
    ) => {
        const { handleExpansion, handleSelection, expanded, selected, focused, disabled } = useTreeItem(nodeId);
        const dispatch = useDispatch();

        const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            handleExpansion(event);
        };

        const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            handleSelection(event);
            dispatch(setSelectionAction(nodeId));
        };

        const classNames = createClassName(className, classes.root, {
            [classes.expanded]: expanded,
            [classes.selected]: selected,
            [classes.focused]: focused,
            [classes.disabled]: disabled,
        });

        const createContent = () => {
            if (editable) {
                const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) =>
                    dispatch(updateSentenceAction(event.target.value));

                return (
                    <TextField
                        variant="standard"
                        value={label}
                        placeholder="Type a sentence."
                        onClick={handleSelectionClick}
                        className={classes.label}
                        onChange={onChangeText}
                    />
                );
            } else {
                return (
                    <Typography component="div" onClick={handleSelectionClick} className={classes.label}>
                        {label}
                    </Typography>
                );
            }
        };

        return (
            <div ref={ref} className={classNames}>
                <div onClick={handleExpansionClick} className={classes.iconContainer}>
                    {icon ?? expansionIcon ?? displayIcon}
                </div>
                {createContent()}
            </div>
        );
    };

const EditableTreeItemContent = React.forwardRef(createTreeItemContent(true));

const TreeItemContent = React.forwardRef(createTreeItemContent(false));

const TreeItemWrapper: React.FunctionComponent<TreeItemWrapperProps> = ({
    text,
    circleId,
    lineSlots,
    editable,
    children,
}) => {
    const dispatch = useDispatch();
    const hasChildren = React.Children.toArray(children).length > 0 || lineSlots.length > 0;

    return (
        <StyledTreeItem
            nodeId={circleId}
            label={text}
            ContentComponent={editable ? EditableTreeItemContent : TreeItemContent}
            onMouseEnter={() => dispatch(setHoveringAction(circleId))}
            onMouseLeave={() => dispatch(setHoveringAction())}
        >
            {hasChildren && (
                <>
                    {children}
                    {lineSlots.map((slot) => (
                        <StyledTreeItem
                            key={slot}
                            ContentComponent={TreeItemContent}
                            nodeId={slot}
                            label="LINE"
                            onMouseEnter={() => dispatch(setHoveringAction(slot))}
                            onMouseLeave={() => dispatch(setHoveringAction())}
                        />
                    ))}
                </>
            )}
        </StyledTreeItem>
    );
};

export default TreeItemWrapper;
