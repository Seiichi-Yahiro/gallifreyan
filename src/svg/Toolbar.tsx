import historyThunks from '@/redux/history/historyThunks';
import { useAppDispatch, useRedux } from '@/redux/hooks';
import IconButton from '@/ui/IconButton';
import cn from '@/utils/cn';
import { Redo, Undo } from 'lucide-react';
import React from 'react';

interface ToolbarProps {
    className?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ className }) => {
    const dispatch = useAppDispatch();
    const canUndo = useRedux((state) => state.history.past.length > 0);
    const canRedo = useRedux((state) => state.history.future.length > 0);

    return (
        <div className={cn(className)}>
            <IconButton
                aria-label="Undo"
                disabled={!canUndo}
                onClick={() => dispatch(historyThunks.undo())}
            >
                <Undo />
            </IconButton>
            <IconButton
                aria-label="Redo"
                disabled={!canRedo}
                onClick={() => dispatch(historyThunks.redo())}
            >
                <Redo />
            </IconButton>
        </div>
    );
};

export default Toolbar;
