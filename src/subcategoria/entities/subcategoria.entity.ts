import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'Subcategoria' })
export class Subcategoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoria: string;

  @Column()
  subcategoria: string;
}
