import ExportButton from '@/sidebar/ExportButton';
import SentenceInput from '@/sidebar/SentenceInput';
import ElementSettings from '@/sidebar/settings/ElementSettings';
import TextTree from '@/sidebar/TextTree';
import cn from '@/utils/cn';
import React from 'react';

interface SidebarProps {
    className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
    return (
        <div className={cn('flex flex-col p-1', className)}>
            <SentenceInput />
            <ExportButton />
            <TextTree className="min-h-24 grow overflow-y-auto pr-1" />
            <ElementSettings className="border-border border-t pt-1" />
        </div>
    );
};

export default React.memo(Sidebar);
