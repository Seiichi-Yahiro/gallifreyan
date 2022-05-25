import { ImageType, UUID } from '../image/ImageTypes';

export interface Selection {
    id: UUID;
    type: ImageType;
}
