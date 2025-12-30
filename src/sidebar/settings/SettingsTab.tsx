import OtherSettings from '@/sidebar/settings/OtherSettings';
import SvgSettings from '@/sidebar/settings/SvgSettings';
import TextSettings from '@/sidebar/settings/TextSettings';
import React from 'react';

const SettingsTab: React.FC = () => {
    return (
        <div className="flex flex-col gap-2">
            <TextSettings />
            <SvgSettings />
            <OtherSettings />
        </div>
    );
};

export default SettingsTab;
