import IconButton from '@/ui/IconButton';
import { LaptopMinimal, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react';

interface ThemeSwitcherProps {
    className?: string;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className }) => {
    const { theme, setTheme } = useTheme();
    const id = 'theme-switcher-label';

    return (
        <div className={className}>
            <span>
                <label id={id}>Theme</label>
                <span aria-hidden={true}>:</span>
            </span>
            <div
                role="radiogroup"
                aria-labelledby={id}
                className="flex flex-row gap-1"
            >
                <IconButton
                    role="radio"
                    aria-label="Dark mode"
                    data-state={theme === 'dark' ? 'checked' : 'unchecked'}
                    className="data-[state=checked]:bg-hover-accent-strong"
                    onClick={() => setTheme('dark')}
                >
                    <Moon />
                </IconButton>
                <IconButton
                    role="radio"
                    aria-label="System theme"
                    data-state={theme === 'system' ? 'checked' : 'unchecked'}
                    className="data-[state=checked]:bg-hover-accent-strong"
                    onClick={() => setTheme('system')}
                >
                    <LaptopMinimal />
                </IconButton>
                <IconButton
                    role="radio"
                    aria-label="Light mode"
                    data-state={theme === 'light' ? 'checked' : 'unchecked'}
                    className="data-[state=checked]:bg-hover-accent-strong"
                    onClick={() => setTheme('light')}
                >
                    <Sun />
                </IconButton>
            </div>
        </div>
    );
};

export default ThemeSwitcher;
