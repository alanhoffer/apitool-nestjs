import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity({name: 'news'})
@Index('idx_date', ['date'])
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: false })
  title: string;

  @Column({ length: 1000, nullable: false })
  content: string;

  @Column({ nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => User, user => user.news)
  user: User;
}
