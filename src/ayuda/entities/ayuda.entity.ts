
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ayuda' })
export class Ayuda {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  message: string;

}
