import { ImageType, UUID } from '../image/ImageTypes';

export interface Selection {
    id: UUID;
    type: ImageType;
    isDragging: boolean;
    justDragged: boolean;
    angleConstraints?: AngleConstraints;
}

export interface AngleConstraints {
    minAngle: number;
    maxAngle: number;
}
