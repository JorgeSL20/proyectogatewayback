import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'producto' })
export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    imagenP: string;

    @Column()
    producto: string;

    @Column()
    categoria: string;

    @Column()
    marca: string;

    @Column()
    descripcion: string;

    @Column()
    precio: number;

    @Column()
    existencias: number;

}
