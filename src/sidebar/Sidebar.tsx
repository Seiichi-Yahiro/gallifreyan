import SentenceInput from '@/sidebar/SentenceInput';
import TextTree from '@/sidebar/TextTree';
import cn from '@/utils/cn';
import React from 'react';

interface SidebarProps {
    className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
    return (
        <div className={cn('flex flex-col', className)}>
            <SentenceInput />
            <TextTree className="grow" />
        </div>
    );
};

export default React.memo(Sidebar);
