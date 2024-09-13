import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Apiary } from "../apiary.entity";


@Entity('apiary_setting')
export class Settings {

    @PrimaryGeneratedColumn()
    id: number;
    
    @PrimaryColumn({nullable: false})
    apiaryId: number;
    
    @PrimaryColumn({nullable: false})
    apiaryUserId: number;

    @Column({default: true })
    honey: boolean;

    @Column({default: true })
    levudex: boolean;

    @Column({default: true })
    sugar: boolean;

    @Column({default: true })
    box: boolean;

    @Column({default: true })
    boxMedium: boolean;

    @Column({default: true })
    boxSmall: boolean;

    @Column({default: true })
    tOxalic: boolean;

    @Column({default: true })
    tAmitraz: boolean;

    @Column({default: true })
    tFlumetrine: boolean;

    @Column({default: true })
    tFence: boolean;

    @Column({default: true })
    tComment: boolean;

    @Column({default: true })
    transhumance: boolean;

    @Column({default: false})
    harvesting: boolean;

    @OneToOne(() => Apiary, (apiary) => apiary.settings, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    apiary:Apiary

}