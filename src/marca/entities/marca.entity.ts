import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'marca' })
export class Marca {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    marca: string;
}