import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'categoria' })
export class Categoria {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    categoria: string;
}
