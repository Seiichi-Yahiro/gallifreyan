import { Vector2 } from '../../utils/LinearAlgebra';
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
    minAngleVector: Vector2;
    maxAngle: number;
    maxAngleVector: Vector2;
}
