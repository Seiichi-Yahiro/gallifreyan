import ExportButton from '@/sidebar/ExportButton';
import TextTab from '@/sidebar/text/TextTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/Tabs';
import cn from '@/utils/cn';
import { Download, Settings, Type } from 'lucide-react';
import React from 'react';

interface SidebarProps {
    className?: string;
}

enum TabName {
    Text = 'Text',
    Settings = 'Settings',
    Export = 'Export',
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
    return (
        <Tabs
            defaultValue={TabName.Text}
            orientation="vertical"
            className={cn(className)}
        >
            <TabsList className="bg-background border-border rounded-none border-r">
                <TabsTrigger
                    value={TabName.Text}
                    className="data-[state=inactive]:hover:bg-hover-accent data-[state=active]:bg-hover-accent-strong"
                >
                    <Type />
                </TabsTrigger>
                <TabsTrigger
                    value={TabName.Settings}
                    className="data-[state=inactive]:hover:bg-hover-accent data-[state=active]:bg-hover-accent-strong"
                >
                    <Settings />
                </TabsTrigger>
                <TabsTrigger
                    value={TabName.Export}
                    className="data-[state=inactive]:hover:bg-hover-accent data-[state=active]:bg-hover-accent-strong"
                >
                    <Download />
                </TabsTrigger>
            </TabsList>
            <TabsContent value={TabName.Text} className="grow">
                <TextTab />
            </TabsContent>
            <TabsContent
                value={TabName.Settings}
                className="grow"
            ></TabsContent>
            <TabsContent value={TabName.Export} className="grow">
                <ExportButton />
            </TabsContent>
        </Tabs>
    );
};

export default React.memo(Sidebar);
