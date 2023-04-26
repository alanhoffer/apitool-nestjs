import { Apiary } from 'src/apiarys/apiary.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Role } from './role.enum';

@Entity({name:'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: false} )
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ nullable: true })
    authStrategy: string;

    @Column({
        type: "enum",
        enum: Role,
        default: Role.User,
    })
    role: Role;

    @OneToMany(() => Apiary, apiary => apiary.user )    
    @JoinColumn()
    apiarys: Apiary[];
}
