import { useRedux } from '@/redux/hooks';
import IconButton from '@/ui/IconButton';
import { ImageDown } from 'lucide-react';
import React from 'react';

const prepareSvg = (svg: HTMLElement): string => {
    const svgClone = svg.cloneNode(true) as SVGSVGElement;

    svgClone.querySelectorAll('.print\\:hidden').forEach((el) => el.remove());

    svgClone.querySelectorAll('[class]').forEach((el) => {
        el.classList.forEach((cls) => {
            if (cls.endsWith('--not-print')) {
                el.classList.remove(cls);
            }
        });
    });

    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgClone);
};

const saveAsFile = async (svg: string, filename: string) => {
    const fileHandle = await window.showSaveFilePicker({
        types: [
            {
                description: 'SVG',
                accept: { 'image/svg+xml': '.svg' },
            },
        ],
        excludeAcceptAllOption: true,
        startIn: 'downloads',
        suggestedName: filename,
    });

    const writable = await fileHandle.createWritable();
    await writable.write(svg);
    await writable.close();
};

const downloadAsFile = (svg: string, filename: string) => {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename + '.svg';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
};

const ExportButton: React.FC = () => {
    const filename = useRedux((state) =>
        state.main.text.rootElement
            ? state.main.text.elements[state.main.text.rootElement].text
            : '',
    );

    return (
        <IconButton
            title="Export as Svg"
            disabled={filename.length === 0}
            onClick={async () => {
                const svg = document.getElementById('gallifreyan');

                if (!svg) {
                    return;
                }

                const svgString = prepareSvg(svg);

                if ('showSaveFilePicker' in window) {
                    await saveAsFile(svgString, filename);
                } else {
                    downloadAsFile(svgString, filename);
                }
            }}
        >
            <ImageDown />
        </IconButton>
    );
};

export default React.memo(ExportButton);
