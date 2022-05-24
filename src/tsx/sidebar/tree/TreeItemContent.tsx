import { TextField, Typography } from '@mui/material';
import { TreeItemContentProps, useTreeItem } from '@mui/lab';
import React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setSentence } from '../../state/image/ImageThunks';
import { setSelection } from '../../state/work/WorkActions';
import createClassName from '../../utils/createClassName';

const createTreeItemContent =
    (editable: boolean) =>
    (
        { icon, expansionIcon, displayIcon, className, classes, nodeId, label }: TreeItemContentProps,
        ref: React.Ref<HTMLDivElement>
    ) => {
        const { handleExpansion, handleSelection, expanded, selected, focused, disabled } = useTreeItem(nodeId);
        const dispatch = useAppDispatch();

        const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            handleExpansion(event);
        };

        const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            handleSelection(event);
            dispatch(setSelection(nodeId));
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
                    dispatch(setSentence(event.target.value));

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

export const EditableTreeItemContent = React.forwardRef(createTreeItemContent(true));

export const TreeItemContent = React.forwardRef(createTreeItemContent(false));
