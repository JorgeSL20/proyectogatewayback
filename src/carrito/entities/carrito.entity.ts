import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Producto } from 'src/producto/entities/producto.entity';

@Entity()
export class CarritoItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Auth, usuario => usuario.carritoItems)
  usuario: Auth;

  @ManyToOne(() => Producto)
  producto: Producto;

  @Column()
  cantidad: number;
}
