import ExportButton from '@/sidebar/ExportButton';
import SentenceInput from '@/sidebar/SentenceInput';
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
            <div className="grow overflow-y-auto pr-1">
                <TextTree />
            </div>
        </div>
    );
};

export default React.memo(Sidebar);
