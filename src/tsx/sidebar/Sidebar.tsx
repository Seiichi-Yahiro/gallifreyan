import React from 'react';
import SentenceInput from './SentenceInput';
import Settings from './Settings';
import Tree from './Tree';

interface SidebarProps {}

const Sidebar: React.FunctionComponent<SidebarProps> = ({}) => (
    <div className="app__sidebar">
        <SentenceInput />
        <Tree className="sidebar__tree" />
        <Settings className="sidebar__settings" />
    </div>
);

export default Sidebar;
