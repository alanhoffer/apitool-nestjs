import { Settings } from "../setting/settings.entity";

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
    tOxalic?: number;
    tAmitraz?: number;
    tFlumetrine?: number;
    tFence?: number;
    tComment?: string;
    transhumance?: number;
    settings: string;
    createdAt?: Date;
    updatedAt?: Date;

}