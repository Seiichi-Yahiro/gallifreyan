import { useSelector } from 'react-redux';
import { AppStore } from '../state/AppStore';

export function useRedux<S>(selector: (state: AppStore) => S, equalityFn?: (left: S, right: S) => boolean) {
    return useSelector<AppStore, S>(selector, equalityFn);
}
