export enum SVGItemType {
    WORD = 'WORD',
    LETTER = 'LETTER',
    DOT = 'DOT',
    LINE = 'LINE'
}

export interface ISVGBaseItem {
    readonly id: string;
    readonly type: SVGItemType;
    readonly parent?: ISVGBaseItem;
    isHovered: boolean;
    isDragging: boolean;
    children?: ISVGBaseItem[];
}

export interface ISVGCircleItem extends ISVGBaseItem {
    readonly parent?: ISVGCircleItem;
    x: number;
    y: number;
    r: number;
}

export interface IWord extends ISVGCircleItem {
    text: string;
    children: ILetter[];
    angles: number[];
}

export interface ILetter extends ISVGCircleItem {
    readonly parent: IWord;
    text: string;
    angles: number[];
    children: IDot[];
}

export interface IDot extends ISVGCircleItem {
    readonly parent: ILetter;
}

export interface ISVGLineItem extends ISVGBaseItem {
    // TODO create line item
}
