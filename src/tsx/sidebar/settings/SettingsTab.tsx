import React from 'react';
import ThemeModeSwitch from './ThemeModeSwitch';

const SettingsTab: React.FunctionComponent = () => {
    return (
        <div className="sidebar-settings">
            <ThemeModeSwitch />
        </div>
    );
};

export default SettingsTab;
