import { IsOptional } from "class-validator";
import { Settings } from "../setting/settings.entity";

export class createApiaryDto {

    userId: number;
    
    name: string;
    hives: number;
    status: string;


    @IsOptional()
    image?: string;
    
    @IsOptional()
    honey?: number;
    
    @IsOptional()
    levudex?: number;
    
    @IsOptional()
    sugar?: number;
    
    @IsOptional()
    box?: number;
    
    @IsOptional()
    boxMedium?: number;
    
    @IsOptional()
    boxSmall?: number;

    @IsOptional()
    tOxalic?: number;

    @IsOptional()
    tAmitraz?: number;

    @IsOptional()
    tFlumetrine?: number;

    @IsOptional()
    tFence?: number;

    @IsOptional()
    tComment?: string;

    @IsOptional()
    transhumance?: number;

    settings: string;

    @IsOptional()
    createdAt?: Date;

    @IsOptional()
    updatedAt?: Date;

}