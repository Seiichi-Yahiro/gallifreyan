import historyThunks from '@/redux/history/history.thunks';
import { useAppDispatch } from '@/redux/hooks';
import { debounce } from 'es-toolkit';

export const useSaveHistoryDebounced = () => {
    const dispatch = useAppDispatch();

    return debounce(
        () => {
            dispatch(historyThunks.save());
        },
        500,
        { edges: ['leading'] },
    );
};
