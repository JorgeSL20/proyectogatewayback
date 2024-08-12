import { Column, Entity, PrimaryGeneratedColumn,Unique } from "typeorm";

@Entity({ name: 'Subcategoria' })
@Unique(['Subcategoria']) // Agregar índice único
export class Subcategoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoria: string;

  @Column()
  subcategoria: string;
}
