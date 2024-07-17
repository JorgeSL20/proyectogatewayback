import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Auth } from '../../auth/entities/auth.entity';
import { Producto } from '../../producto/entities/producto.entity';

@Entity()
export class Carrito {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Auth, auth => auth.carritos)
  usuario: Auth;

  @ManyToOne(() => Producto, producto => producto.carritos)
  producto: Producto;

  @Column()
  cantidad: number;
}
