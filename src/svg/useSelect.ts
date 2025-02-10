import { useAppDispatch, useRedux } from '@/redux/hooks';
import svgActions from '@/redux/svg/svgActions';
import type { CircleId } from '@/redux/svg/svgTypes';
import type { LineSlotId } from '@/redux/text/ids';
import { useCallback } from 'react';

const useSelect = (id: CircleId | LineSlotId) => {
    const dispatch = useAppDispatch();

    const isSelected = useRedux((state) => state.main.selected === id);

    const onSelect = useCallback(() => {
        dispatch(svgActions.setSelection(id));
    }, [dispatch, id]);

    return { isSelected, onSelect };
};

export default useSelect;
