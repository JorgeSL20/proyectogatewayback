import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Auth } from 'src/auth/entities/auth.entity';

@Entity({ name: 'pagos' })
export class Pago {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @Column()
    currency: string;

    @Column()
    status: string;

    @Column()
    transactionId: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(() => Auth, auth => auth.pagos)
    @JoinColumn({ name: 'usuario_id' })
    usuario: Auth;
}
