import OtherSettings from '@/sidebar/settings/OtherSettings';
import TextSettings from '@/sidebar/settings/TextSettings';
import React from 'react';

const SettingsTab: React.FC = () => {
    return (
        <div className="flex flex-col gap-2">
            <TextSettings />
            <OtherSettings />
        </div>
    );
};

export default SettingsTab;
