import ThemeSwitcher from '@/sidebar/settings/ThemeSwitcher';
import React from 'react';

interface OtherSettingsProps {
    className?: string;
}

const OtherSettings: React.FC<OtherSettingsProps> = ({ className }) => {
    const id = 'other-settings-label';

    return (
        <section aria-labelledby={id} className={className}>
            <h2 id={id} className="font-semibold">
                Other
            </h2>
            <ThemeSwitcher />
        </section>
    );
};

export default OtherSettings;
