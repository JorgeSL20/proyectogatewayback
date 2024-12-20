import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Logs } from './logs.entity';
import { Carrito } from 'src/carrito/entities/carrito.entity';
import { Pago } from 'src/pago/entities/pago.entity';
import { Feedback } from 'src/feedback/entities/feedback.entity';

@Entity({ name: 'usuarios' })
export class Auth {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    lastNameP: string;

    @Column()
    lastNameM: string;

    @Column()
    password: string;

    @Column()
    pregunta: string;

    @Column()
    respuesta: string;

    @Column({ default: 'https://res.cloudinary.com/dkwb9vcbb/image/upload/v1731552340/user_images/user_kukjch.jpg ' })
    url: string;

    @Column({ nullable: true })
    intentos?: number | null;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastAttempt: Date;

    @Column({ default: 'user' }) // Valor por defecto 'user'
    role: string;

    @Column({ nullable: true }) // Nueva columna para feedback
    feedback?: string | null;

    @OneToMany(() => Logs, logs => logs.usuario)
    logs: Logs[];

    @OneToMany(() => Carrito, carrito => carrito.usuario)
    carritos: Carrito[];

    @OneToMany(() => Pago, pago => pago.usuario)
    pagos: Pago[];

    @OneToMany(() => Feedback, (feedback) => feedback.usuario)
feedbacks: Feedback[];
}


@Entity({ name: 'informacion' })
export class Informacion {
    @PrimaryGeneratedColumn()
    id_informacion: number;

    @Column({ type: 'text' })
    mision: string;

    @Column({ type: 'text' })
    vision: string;

    @Column({ type: 'text' })
    quienessomos: string;
}


@Entity({ name: 'preguntas' })
export class Preguntas {
    @PrimaryGeneratedColumn()
    id_preguntas: number;

    @Column()
    preguntas: string;

    @Column()
    respuestas: string;
}
