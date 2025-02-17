import SentenceInput from '@/sidebar/SentenceInput';
import TextTree from '@/sidebar/TextTree';
import ElementSettings from '@/sidebar/text/settings/ElementSettings';
import React from 'react';

const TextTab: React.FC = () => {
    return (
        <div className="flex h-full flex-col">
            <SentenceInput />
            <TextTree className="min-h-24 grow overflow-y-auto pr-1" />
            <ElementSettings className="border-border border-t pt-1" />
        </div>
    );
};

export default React.memo(TextTab);
