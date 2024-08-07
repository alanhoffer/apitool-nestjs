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
    nombre_columna: string;

    @Column({nullable: true})
    valor_anterior: string;

    @Column({nullable: true})
    valor_nuevo: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha_cambio: Date;


}