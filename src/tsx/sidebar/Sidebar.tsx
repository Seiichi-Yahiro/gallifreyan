import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Paper, Tab } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';
import React, { useState } from 'react';
import SettingsTab from './settings/SettingsTab';
import WorkTab from './work/WorkTab';

interface SidebarProps {}

enum TabValue {
    Work = 'Work',
    Settings = 'Settings',
}

const Sidebar: React.FunctionComponent<SidebarProps> = ({}) => {
    const [tab, setTabValue] = useState(TabValue.Work);

    const onTabChange = (_event: React.SyntheticEvent, value: TabValue) => {
        setTabValue(value);
    };

    return (
        <Paper variant="outlined" className="app__sidebar">
            <TabContext value={tab}>
                <TabList variant="fullWidth" onChange={onTabChange}>
                    <Tab icon={<EditIcon />} value={TabValue.Work} />
                    <Tab icon={<SettingsIcon />} value={TabValue.Settings} />
                </TabList>
                <div className="sidebar__panels">
                    <TabPanel value={TabValue.Work} className="sidebar__panel">
                        <WorkTab />
                    </TabPanel>
                    <TabPanel value={TabValue.Settings} className="sidebar__panel">
                        <SettingsTab />
                    </TabPanel>
                </div>
            </TabContext>
        </Paper>
    );
};

export default Sidebar;
