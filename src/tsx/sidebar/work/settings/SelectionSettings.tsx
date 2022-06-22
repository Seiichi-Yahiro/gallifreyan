import React from 'react';
import { useRedux } from '../../../hooks/useRedux';
import { ImageType } from '../../../state/image/ImageTypes';
import ConsonantSettings from './ConsonantSettings';
import DotSettings from './DotSettings';
import LineSlotSettings from './LineSlotSettings';
import SentenceSettings from './SentenceSettings';
import VocalSettings from './VocalSettings';
import WordSettings from './WordSettings';

interface SettingsProps {
    className?: string;
}

const SelectionSettings: React.FunctionComponent<SettingsProps> = ({ className }) => {
    const selection = useRedux(
        (state) => state.work.selection,
        (left, right) => left?.id === right?.id && left?.type === right?.type
    );

    if (!selection) {
        return null;
    }

    const createSettings = () => {
        switch (selection.type) {
            case ImageType.Sentence:
                return <SentenceSettings id={selection.id} />;
            case ImageType.Word:
                return <WordSettings id={selection.id} />;
            case ImageType.Consonant:
                return <ConsonantSettings id={selection.id} />;
            case ImageType.Vocal:
                return <VocalSettings id={selection.id} />;
            case ImageType.Dot:
                return <DotSettings id={selection.id} />;
            case ImageType.LineSlot:
                return <LineSlotSettings id={selection.id} />;
            case ImageType.LineConnection:
                return null;
        }
    };

    return <div className={className}>{createSettings()}</div>;
};

export default React.memo(SelectionSettings);
