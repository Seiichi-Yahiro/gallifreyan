import React from 'react';
import Settings from './Settings';
import Tree from './tree/Tree';

interface SidebarProps {}

const Sidebar: React.FunctionComponent<SidebarProps> = ({}) => (
    <div className="app__sidebar">
        <Tree className="sidebar__tree" />
        <Settings className="sidebar__settings" />
    </div>
);

export default Sidebar;
