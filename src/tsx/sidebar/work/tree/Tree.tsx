import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';
import { TreeView } from '@mui/lab';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useRedux } from '../../../hooks/useRedux';
import { UUID } from '../../../state/image/ImageTypes';
import { setExpandedTreeNodes } from '../../../state/work/WorkActions';
import SentenceTreeItem from './SentenceTreeItem';

const MinusSquare: React.FunctionComponent<SvgIconProps> = React.memo((props: SvgIconProps) => (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
));

const PlusSquare: React.FunctionComponent<SvgIconProps> = React.memo((props: SvgIconProps) => (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
));

const CloseSquare: React.FunctionComponent<SvgIconProps> = React.memo((props: SvgIconProps) => (
    <SvgIcon className="close" fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
        <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
));

interface TreeProps {
    className?: string;
}

const Tree: React.FunctionComponent<TreeProps> = ({ className }) => {
    const dispatch = useAppDispatch();
    const selectionId = useRedux((state) => state.work.selection?.id);
    const sentenceId = useRedux((state) => state.image.rootCircleId);
    const expanded = useRedux((state) => state.work.expandedTreeNodes);

    const onNodeToggle = (_event: React.SyntheticEvent, nodeIds: UUID[]) => {
        dispatch(setExpandedTreeNodes(nodeIds));
    };

    return (
        <TreeView
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
            selected={selectionId ?? ''}
            className={className}
            expanded={expanded}
            onNodeToggle={onNodeToggle}
        >
            {sentenceId && <SentenceTreeItem id={sentenceId} />}
        </TreeView>
    );
};

export default Tree;
