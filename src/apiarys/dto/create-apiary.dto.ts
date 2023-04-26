import { Settings } from "../settings.entity";

export class createApiaryDto {
    
    name: string;
    hives: number;
    status: string;
    image?: string;
    honey?: number;
    levudex?: number;
    sugar?: number;
    box?: number;
    boxMedium?: number;
    boxSmall?: number;
    tAxalic?: number;
    tAmitraz?: number;
    tFlumetrine?: number;
    tFence?: number;
    tComment?: string;
    settings:Settings;
    createdAt?: Date;
    updatedAt?: Date;

}