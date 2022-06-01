import { Paper } from '@mui/material';
import React from 'react';
import Settings from './Settings';
import TextInput from './TextInput';
import Tree from './tree/Tree';

interface SidebarProps {}

const Sidebar: React.FunctionComponent<SidebarProps> = ({}) => (
    <Paper variant="outlined" className="app__sidebar">
        <TextInput />
        <Tree className="sidebar__tree" />
        <Settings className="sidebar__settings" />
    </Paper>
);

export default Sidebar;
