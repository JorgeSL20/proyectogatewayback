import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'carruseles' })
export class Carrusel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  publicId: string;

  // Puedes agregar más propiedades según sea necesario
}
