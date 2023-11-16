import { Apiary } from 'src/apiary/apiary.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Role } from './role.enum';
import * as bcrypt from 'bcrypt';
import { Exclude, instanceToPlain } from 'class-transformer';
import { News } from 'src/news/entities/news.entity';

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;


    @Column({ nullable: false })
    name:string;

    @Column({ nullable: false })
    surname:string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Exclude({ toPlainOnly: true })
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

    @OneToMany(() => Apiary, apiary => apiary.user)
    @JoinColumn()
    apiarys: Apiary[];

    @OneToMany(() => News, news => news.user)
    news: News[];

    toJSON() {
        return instanceToPlain(this);
    }

    validatePassword(pass: string) {
        return bcrypt.compareSync(pass, this.password);
    }
}
