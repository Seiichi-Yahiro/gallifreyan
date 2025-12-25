import { useRef } from 'react';

export type UiTransaction<T> = {
    startValue: T;
    currentValue: T;
};

export type UseUiTransactionProps<T> = {
    value: T;
    onChange?: (value: T) => void;
    onChangeCommitted?: (value: T) => void;
};

const useUiTransaction = <T>({
    value,
    onChange,
    onChangeCommitted,
}: UseUiTransactionProps<T>) => {
    const transaction = useRef<UiTransaction<T> | null>(null);

    const beginTransactionIfNeeded = (initialValue: T) => {
        if (transaction.current !== null) {
            return;
        }

        transaction.current = {
            startValue: initialValue,
            currentValue: initialValue,
        };
    };

    const updateTransactionValue = (next: T) => {
        if (transaction.current === null) {
            beginTransactionIfNeeded(value);
        }

        if (transaction.current!.currentValue !== next) {
            transaction.current!.currentValue = next;
            onChange?.(next);
        }
    };

    const commitTransaction = () => {
        const tx = transaction.current;

        if (tx === null) {
            return;
        }

        if (tx.startValue !== tx.currentValue) {
            onChangeCommitted?.(tx.currentValue);
        }

        transaction.current = null;
    };

    return {
        beginTransactionIfNeeded,
        updateTransactionValue,
        commitTransaction,
    };
};

export default useUiTransaction;
