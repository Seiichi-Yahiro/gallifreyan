import { Typography } from '@mui/material';
import { TreeItemContentProps, useTreeItem } from '@mui/lab';
import React from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { AppThunkAction } from '../../state/AppState';
import { UUID } from '../../state/image/ImageTypes';
import createClassName from '../../utils/createClassName';

export const createTreeItemContent = (select: (id: UUID) => AppThunkAction): React.FunctionComponent =>
    React.forwardRef(
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
                dispatch(select(nodeId));
            };

            const classNames = createClassName(className, classes.root, {
                [classes.expanded]: expanded,
                [classes.selected]: selected,
                [classes.focused]: focused,
                [classes.disabled]: disabled,
            });

            return (
                <div ref={ref} className={classNames}>
                    <div onClick={handleExpansionClick} className={classes.iconContainer}>
                        {icon ?? expansionIcon ?? displayIcon}
                    </div>
                    <Typography component="div" onClick={handleSelectionClick} className={classes.label}>
                        {label}
                    </Typography>
                </div>
            );
        }
    );
