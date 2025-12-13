import { useRedux } from '@/redux/hooks';
import {
    convertSvgHtmlElementToString,
    downloadAsFile,
    saveAsFile,
} from '@/sidebar/export/svgExport';
import IconButton from '@/ui/IconButton';
import { ImageDown } from 'lucide-react';
import React from 'react';

const ExportButton: React.FC = () => {
    const filename = useRedux((state) =>
        state.text.rootElement
            ? state.text.elements[state.text.rootElement].text
            : '',
    );

    return (
        <IconButton
            title="Export as Svg"
            disabled={filename.length === 0}
            onClick={() => {
                const svg = document.getElementById('gallifreyan');

                if (!svg) {
                    return;
                }

                const svgString = convertSvgHtmlElementToString(svg);

                if ('showSaveFilePicker' in window) {
                    void saveAsFile(svgString, filename);
                } else {
                    downloadAsFile(svgString, filename);
                }
            }}
        >
            <ImageDown />
        </IconButton>
    );
};

export default ExportButton;
