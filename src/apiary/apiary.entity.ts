import { User } from '../user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, Index, PrimaryColumn } from 'typeorm';
import { Settings } from './setting/settings.entity';

@Entity({ name: 'apiary' })
export class Apiary {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    name: string;

    @Column({nullable: false})
    userId: number;

    @Column({ default: `apiary-default.png` })
    image: string;

    @Column({ default: 0 })
    hives: number;

    @Column({ default: 'normal' })
    status: string;

    @Column({ default: 0 })
    honey: number;

    @Column({ default: 0 })
    levudex: number;

    @Column({ default: 0 })
    sugar: number;

    @Column({ default: 0 })
    box: number;

    @Column({ default: 0 })
    boxMedium: number;

    @Column({ default: 0 })
    boxSmall: number;

    @Column({ default: 0 })
    tOxalic: number;

    @Column({ default: 0 })
    tAmitraz: number;

    @Column({ default: 0 })
    tFlumetrine: number;

    @Column({ default: 0 })
    tFence: number;

    @Column({ default: '' })
    tComment: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => User, user => user.apiarys,{
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    user: User;

    @OneToOne(() => Settings, settings => settings.apiary)
    settings: Settings

}