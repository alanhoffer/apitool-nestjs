import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity('apiary_history')
export class History {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId:number;
    
    @Column()
    apiaryId: number;
    
    @Column()
    field: string;

    @Column({nullable: true})
    previousValue: string;

    @Column({nullable: true})
    newValue: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    changeDate: Date;


}