import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"; 
import { Logs } from "./logs.entity";
import { Carrito } from "src/carrito/entities/carrito.entity";

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

    @Column({ nullable: true })
    intentos?: number | null;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    lastAttempt: Date;

    @OneToMany(() => Logs, logs => logs.usuario)
    logs: Logs[];
    
    @OneToMany(() => Carrito, carrito => carrito.usuario)
    carritos: Carrito[];
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
