import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'categoria' })
@Unique(['categoria']) // Agregar índice único
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoria: string;
}
