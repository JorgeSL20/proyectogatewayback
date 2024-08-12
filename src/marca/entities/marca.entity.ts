import { Column, Entity, PrimaryGeneratedColumn,Unique } from "typeorm";

@Entity({ name: 'marca' })
@Unique(['marca'])
export class Marca {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    marca: string;
}