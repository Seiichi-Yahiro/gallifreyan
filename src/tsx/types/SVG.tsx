export interface ISVGBaseItem {
    readonly id: string;
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
