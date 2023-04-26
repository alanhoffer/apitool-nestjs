import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Apiary } from "./apiary.entity";
import { User } from "src/users/user.entity";


@Entity('apiarys_history')
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

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    fecha_cambio: Date;


}