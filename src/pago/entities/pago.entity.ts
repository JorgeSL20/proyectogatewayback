// src/pago/entities/pago.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Auth } from 'src/auth/entities/auth.entity';

@Entity()
export class Pago {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Auth, auth => auth.pagos)
  usuario: Auth;

  @Column('decimal')
  total: number;

  @Column('json')
  items: any[];
}
