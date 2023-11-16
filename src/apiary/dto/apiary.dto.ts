import {
  IsDate,
  IsInt,
  IsObject,
  IsString,
  Length,
} from 'class-validator';
import { Settings } from '../setting/settings.entity';

export class ApiaryDTO {

  private id: number;
  private name: string;
  private hives: number;
  private status: string;
  private image: string;
  private honey: number;
  private levudex: number;
  private sugar: number;
  private box: number;
  private boxMedium: number;
  private boxSmall: number;
  private tOxalic: number;
  private tAmitraz: number;
  private tFlumetrine: number;
  private tFence: number;
  private tComment: string;
  private settings: Settings;
  private updatedAt: Date;

  constructor() {}

  public get _id(): number {
    return this.id;
  }

  public set _id(id: number) {
    this.id = id;
  }

  public get _name(): string {
    return this.name;
  }

  public set _name(name: string) {
    this.name = name;
  }
  
  @IsInt()
   public get _hives(): number {
    return this.hives;
  }

  public set _hives(value: number) {
    this.hives = value;
  }

  @IsString()
   public get _status(): string {
    return this.status;
  }

  public set _status(value: string) {
    this.status = value;
  }

  @IsString()
   public get _image(): string {
    return this.image;
  }

  public set _image(value: string) {
    this.image = value;
  }

  @IsInt()
   public get _honey(): number {
    return this.honey;
  }

  public set _honey(value: number) {
    this.honey = value;
  }

  @IsInt()
   public get _levudex(): number {
    return this.levudex;
  }

  public set _levudex(value: number) {
    this.levudex = value;
  }

  @IsInt()
   public get _sugar(): number {
    return this._sugar;
  }

  public set _sugar(value: number) {
    this.sugar = value;
  }

  @IsInt()
   public get _box(): number {
    return this.box;
  }

  public set _box(value: number) {
    this.box = value;
  }

  @IsInt()
   public get _boxMedium(): number {
    return this.boxMedium;
  }

  public set _boxMedium(value: number) {
    this.boxMedium = value;
  }

  @IsInt()
   public get _boxSmall(): number {
    return this.boxSmall;
  }

  public set _boxSmall(value: number) {
    this.boxSmall = value;
  }

  @IsInt()
   public get _tOxalic(): number {
    return this.tOxalic;
  }

  public set _tOxalic(value: number) {
    this.tOxalic = value;
  }

  @IsInt()
   public get _tAmitraz(): number {
    return this.tAmitraz;
  }

  public set _tAmitraz(value: number) {
    this.tAmitraz = value;
  }

  @IsInt()
   public get _tFlumetrine(): number {
    return this.tFlumetrine;
  }

  public set _tFlumetrine(value: number) {
    this.tFlumetrine = value;
  }

  @IsInt()
   public get _tFence(): number {
    return this.tFence;
  }

  public set _tFence(value: number) {
    this.tFence = value;
  }

  @IsString()
  @Length(0, 255)
   public get _tComment(): string {
    return this.tComment;
  }

  public set _tComment(value: string) {
    this.tComment = value;
  }

  @IsObject()
   public get _settings(): Settings {
    return this.settings;
  }

  public set _settings(value: Settings) {
    this.settings = value;
  }

  @IsDate()
   public get _updatedAt(): Date {
    return this.updatedAt;
  }

  public set _updatedAt(value: Date) {
    this.updatedAt = value;
  }
}
