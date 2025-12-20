import xmlFormat from 'xml-formatter';
import styleString from './style.css?raw';

export const convertSvgHtmlElementToString = (svg: HTMLElement): string => {
    const svgClone = svg.cloneNode(true) as SVGSVGElement;

    svgClone.querySelectorAll('.print\\:hidden').forEach((el) => el.remove());

    const removeNotPrintClasses = (el: Element) => {
        el.classList.forEach((cls) => {
            if (cls.endsWith('--not-print')) {
                el.classList.remove(cls);
            }
        });
    };

    removeNotPrintClasses(svgClone);
    svgClone.querySelectorAll('[class]').forEach(removeNotPrintClasses);

    const style = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'style',
    );

    style.innerHTML = ('\n' + styleString)
        .split('\n')
        .map((line) => (line.trim() ? ' '.repeat(8) + line : ''))
        .join('\n')
        .trim();

    svgClone.insertBefore(style, svgClone.firstChild);

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);
    return xmlFormat(svgString);
};

export const saveAsFile = async (svg: string, filename: string) => {
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

export const downloadAsFile = (svg: string, filename: string) => {
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
