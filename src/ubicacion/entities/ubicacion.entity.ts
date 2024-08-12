import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Ubicacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;  // Asegúrate de que esta línea esté presente
}
