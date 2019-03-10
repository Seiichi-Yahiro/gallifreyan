import { ISVGBaseItem } from '../types/SVG';

export const getPath = (svgBaseItem: ISVGBaseItem): string[] =>
    svgBaseItem.parent === undefined ? [svgBaseItem.id] : getPath(svgBaseItem.parent).concat(svgBaseItem.id);

export const getSVGItem = (path: string[], children: ISVGBaseItem[]): ISVGBaseItem => {
    if (path.length === 0) {
        throw new Error('Path cannot be empty!');
    } else if (path.length === 1) {
        return children.find(child => child.id === path[0])!;
    } else {
        const svgItem: ISVGBaseItem = children.find(child => child.id === path[0])!;
        if (!svgItem.children) {
            throw new Error(`Path length is ${path.length - 1} too long!`);
        }
        return getSVGItem(path.slice(1), svgItem.children);
    }
};

export const updateSVGItem = (path: string[], newSvgItem: ISVGBaseItem, children: ISVGBaseItem[]): ISVGBaseItem[] => {
    if (path.length === 0) {
        return children;
    } else if (path.length === 1) {
        return children.map(child => (child.id === path[0] ? newSvgItem : child));
    } else {
        return children.map(child => {
            if (child.id === path[0]) {
                if (!child.children) {
                    throw new Error(`Path length is ${path.length - 1} too long!`);
                }

                return {
                    ...child,
                    children: updateSVGItem(path.slice(1), newSvgItem, child.children)
                };
            }

            return child;
        });
    }
};

export const removeSVGItem = (path: string[], children: ISVGBaseItem[]): ISVGBaseItem[] => {
    if (path.length === 0) {
        return children;
    } else if (path.length === 1) {
        return children.filter(child => child.id !== path[0]);
    } else {
        return children.map(child => {
            if (child.id === path[0]) {
                if (!child.children) {
                    throw new Error(`Path length is ${path.length - 1} too long!`);
                }

                return {
                    ...child,
                    children: removeSVGItem(path.slice(1), child.children)
                };
            }

            return child;
        });
    }
};
