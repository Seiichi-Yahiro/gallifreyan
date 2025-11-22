import React, { useCallback, useMemo } from 'react';
import cn from 'src/utils/cn';

interface TextInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: boolean;
    ref?: React.RefObject<HTMLInputElement>;
}

const TextInput: React.FC<TextInputProps> = ({
    label,
    value,
    onChange,
    disabled = false,
    error = false,
    ref,
}) => {
    const id = useMemo(
        () => `${label}-text-input-${crypto.randomUUID}`,
        [label],
    );
    const onChangeInput = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
        },
        [onChange],
    );

    return (
        <div
            className={cn(
                'relative mt-4 mb-1 min-h-6 w-full',

                'before:absolute before:bottom-0 before:left-0 before:w-full',
                'before:border-text hover:before:border-text before:border-b focus-within:before:border-b-2 hover:before:border-b-2',

                'after:absolute after:bottom-0 after:left-0 after:w-full',
                'after:border-accent after:border-b-2',
                'after:scale-x-0 after:transition-transform after:duration-200 after:ease-out focus-within:after:scale-x-100',

                {
                    'text-muted before:border-muted before:border-b before:border-dotted hover:before:border-b':
                        disabled,
                },

                {
                    'before:border-error after:border-error hover:before:border-error hover:before:border-b':
                        error,
                },
            )}
        >
            <input
                ref={ref}
                id={id}
                type="text"
                value={value}
                placeholder=""
                onChange={onChangeInput}
                disabled={disabled}
                aria-invalid={error}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className="peer size-full text-base outline-none"
            />
            <label
                htmlFor={id}
                className={cn(
                    'absolute -top-4 left-0 text-xs transition-all duration-200 ease-out',

                    'peer-placeholder-shown:text-muted peer-placeholder-shown:top-0 peer-placeholder-shown:cursor-text peer-placeholder-shown:text-base',
                    'peer-focus:text-accent peer-focus:-top-4 peer-focus:cursor-default peer-focus:text-xs',

                    {
                        'text-muted': disabled,
                    },

                    {
                        'text-error peer-focus:text-error': error,
                    },
                )}
            >
                {label}
            </label>
        </div>
    );
};

export default TextInput;
