// src/carrusel/entities/carrusel.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'carrusel' })
export class Carrusel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  publicId: string;
}
