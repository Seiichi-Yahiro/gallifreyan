import type { AppDispatch, AppState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useRedux = useSelector.withTypes<AppState>();
