import cn from '@/utils/cn';
import React, { useEffect, useState } from 'react';

interface NumberInputProps
    extends Omit<React.HTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: number;
    min?: number;
    max?: number;
    unit?: string;
    onChange: (value: number) => void;
    className?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
    value,
    min,
    max,
    unit,
    onChange,
    className,
    ...props
}) => {
    const [inputValue, setInputValue] = useState(value.toString());
    const [width, setWidth] = useState<number | undefined>(undefined);
    const measureRef = React.useRef<HTMLSpanElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    useEffect(() => {
        if (!measureRef.current || !inputRef.current) {
            return;
        }

        const measuredWidth = measureRef.current.offsetWidth;
        const stepperPadding = 24;
        setWidth(measuredWidth + stepperPadding);
    }, [inputValue]);

    return (
        <div className="relative inline-flex items-center gap-1">
            <input
                ref={inputRef}
                type="number"
                min={min}
                max={max}
                className={cn(
                    'border-border outline-accent bg-hover-accent min-w-[3ch] appearance-none rounded-sm border pl-1 focus:outline-2 focus:-outline-offset-2',
                    className,
                )}
                style={{ width }}
                value={inputValue}
                onChange={(event) => {
                    const rawValue = event.target.value;
                    setInputValue(rawValue);

                    if (rawValue === '') {
                        return;
                    }

                    const parsedValue = Number(rawValue);
                    if (Number.isNaN(parsedValue)) {
                        return;
                    }

                    if (min !== undefined && parsedValue < min) {
                        return;
                    }

                    if (max !== undefined && parsedValue > max) {
                        return;
                    }

                    if (parsedValue !== value) {
                        onChange(parsedValue);
                    }
                }}
                onBlur={() => {
                    if (inputValue === '') {
                        setInputValue(value.toString());
                        return;
                    }

                    const parsedValue = Number(inputValue);
                    if (Number.isNaN(parsedValue)) {
                        setInputValue(value.toString());
                        return;
                    }

                    let clampedValue = parsedValue;

                    if (min !== undefined) {
                        clampedValue = Math.max(min, clampedValue);
                    }

                    if (max !== undefined) {
                        clampedValue = Math.min(max, clampedValue);
                    }

                    setInputValue(clampedValue.toString());

                    if (clampedValue !== value) {
                        onChange(clampedValue);
                    }
                }}
                {...props}
            />
            {unit !== undefined && (
                <span className="text-muted-foreground">{unit}</span>
            )}
            <span
                ref={measureRef}
                className="invisible absolute pl-1 font-mono whitespace-pre"
            >
                {inputValue === '' ? '0' : inputValue}
            </span>
        </div>
    );
};

export default NumberInput;
