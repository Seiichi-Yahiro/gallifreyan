import { Degree } from '../../utils/LinearAlgebra';
import { ImageType, UUID } from '../image/ImageTypes';

export interface Selection {
    id: UUID;
    type: ImageType;
    isDragging: boolean;
    justDragged: boolean;
}

export interface Constraints {
    angle: AngleConstraints;
    distance: DistanceConstraints;
}

export interface AngleConstraints {
    minAngle: Degree;
    maxAngle: Degree;
}

export interface DistanceConstraints {
    minDistance: number;
    maxDistance: number;
}
