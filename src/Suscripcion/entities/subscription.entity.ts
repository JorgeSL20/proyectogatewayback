import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  endpoint: string;

  @Column('json')
  keys: object;

  @Column({ default: false })
  isActive: boolean;
}
