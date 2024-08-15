// src/producto/entities/producto.entity.ts
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn } from "typeorm";
import { Carrito } from '../../carrito/entities/carrito.entity';

@Entity({ name: 'producto' })
export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

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
    existencias: number;  // Renombrado a 'existencias'

    @CreateDateColumn({ type: 'timestamp' })
    fechaCreacion: Date;  // Nueva propiedad para la fecha de creación

    @OneToMany(() => Carrito, carrito => carrito.producto)
    carritos: Carrito[];
}
