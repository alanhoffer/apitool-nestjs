import { IsOptional } from "class-validator";
import { Settings } from "../setting/settings.entity";
export class updateApiaryDto {
  
    
  @IsOptional()
  image?: string;
    
  @IsOptional()
  hives?: number;
    
  @IsOptional()
  status?: string;
    
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
}
