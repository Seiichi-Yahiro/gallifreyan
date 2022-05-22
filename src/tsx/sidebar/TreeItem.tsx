import { TreeItem as MUITreeItem, treeItemClasses, TreeItemProps } from '@mui/lab';
import { alpha, styled } from '@mui/material';
import React from 'react';

const TreeItem = styled((props: TreeItemProps) => <MUITreeItem {...props} />)(({ theme }) => ({
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

export default TreeItem;
