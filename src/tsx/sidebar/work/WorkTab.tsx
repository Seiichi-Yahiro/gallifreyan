import React from 'react';
import SelectionSettings from './settings/SelectionSettings';
import TextInput from './TextInput';
import Tree from './tree/Tree';

const WorkTab: React.FunctionComponent = () => {
    return (
        <div className="sidebar-work">
            <TextInput />
            <Tree className="sidebar-work__tree" />
            <SelectionSettings className="sidebar-work__settings" />
        </div>
    );
};

export default WorkTab;
