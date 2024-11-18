import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Auth } from 'src/auth/entities/auth.entity';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  rating: string;

  @ManyToOne(() => Auth, (auth) => auth.feedbacks)
  usuario: Auth;
}
